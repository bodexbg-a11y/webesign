"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  type Absence,
  type Assignment,
  type ColumnCode,
  type Employee,
  type Position,
  type Rd2State,
  type RowKind,
  todayIso,
} from "./model";

type CellWrite = {
  positionId: number;
  columnCode: ColumnCode;
  rowKind: RowKind;
  items: { employeeId: number; note: string }[];
};

type Status = { kind: "info" | "error"; text: string } | null;

type Rd2Context = {
  state: Rd2State | null;
  loading: boolean;
  saving: boolean;
  status: Status;
  date: string;
  setDate: (iso: string) => void;
  notify: (text: string, kind?: "info" | "error") => void;
  refresh: () => Promise<void>;
  writeCells: (cells: CellWrite[]) => Promise<void>;
  copySheet: (fromDate: string) => Promise<void>;
  clearSheet: () => Promise<void>;
  seedFromSheet: () => Promise<boolean>;
  addEmployee: (input: Partial<Employee>) => Promise<boolean>;
  patchEmployee: (id: number, input: Partial<Employee>) => Promise<boolean>;
  removeEmployee: (id: number) => Promise<boolean>;
  patchPosition: (id: number, input: Partial<Position>) => Promise<boolean>;
  addAbsence: (input: Partial<Absence>) => Promise<boolean>;
  patchAbsence: (id: number, input: Partial<Absence>) => Promise<boolean>;
  removeAbsence: (id: number) => Promise<boolean>;
};

const Ctx = createContext<Rd2Context | null>(null);

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: init?.body ? { "content-type": "application/json" } : undefined,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((payload as { error?: string }).error || `Помилка запиту (${response.status})`);
  }
  return payload as T;
}

export function Rd2Provider({ children }: { children: ReactNode }) {
  const [date, setDateValue] = useState(todayIso);
  const [state, setState] = useState<Rd2State | null>(null);
  // Замість окремого прапорця завантаження тримаємо дату, для якої дані вже
  // в пам'яті: інакше довелося б викликати setState синхронно всередині ефекту.
  const [loadedDate, setLoadedDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notify = useCallback((text: string, kind: "info" | "error" = "info") => {
    setStatus({ kind, text });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus(null), kind === "error" ? 6000 : 2600);
  }, []);

  const load = useCallback(
    async (iso: string) => {
      try {
        const data = await request<Rd2State>(`/api/rd2/state?date=${iso}`);
        setState(data);
      } catch (error) {
        setState(null);
        notify(error instanceof Error ? error.message : "Не вдалося завантажити дані", "error");
      } finally {
        setLoadedDate(iso);
      }
    },
    [notify],
  );

  const loading = loadedDate !== date;

  // Первинне завантаження та зміна дати: стан оновлюється лише у колбеках
  // промісу, тож синхронних каскадних рендерів усередині ефекту немає.
  useEffect(() => {
    let cancelled = false;
    request<Rd2State>(`/api/rd2/state?date=${date}`)
      .then((data) => {
        if (!cancelled) setState(data);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setState(null);
        notify(error instanceof Error ? error.message : "Не вдалося завантажити дані", "error");
      })
      .finally(() => {
        if (!cancelled) setLoadedDate(date);
      });
    return () => {
      cancelled = true;
    };
  }, [date, notify]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const setDate = useCallback((iso: string) => setDateValue(iso), []);

  const guarded = useCallback(
    async (action: () => Promise<void>, success?: string) => {
      setSaving(true);
      try {
        await action();
        if (success) notify(success);
        return true;
      } catch (error) {
        notify(error instanceof Error ? error.message : "Помилка збереження", "error");
        return false;
      } finally {
        setSaving(false);
      }
    },
    [notify],
  );

  const writeCells = useCallback(
    async (cells: CellWrite[]) => {
      if (!state) return;
      const affected = new Set(cells.map((cell) => `${cell.positionId}:${cell.columnCode}:${cell.rowKind}`));
      const optimistic: Assignment[] = state.assignments.filter(
        (row) => !affected.has(`${row.positionId}:${row.columnCode}:${row.rowKind}`),
      );
      let tempId = -1;
      for (const cell of cells) {
        cell.items.forEach((item, index) => {
          optimistic.push({
            id: tempId--,
            sheetDate: date,
            positionId: cell.positionId,
            columnCode: cell.columnCode,
            rowKind: cell.rowKind,
            slotIndex: index,
            employeeId: item.employeeId,
            note: item.note,
          });
        });
      }
      setState({ ...state, assignments: optimistic });

      await guarded(async () => {
        const result = await request<{ assignments: Assignment[] }>("/api/rd2/assignments", {
          method: "POST",
          body: JSON.stringify({ date, cells }),
        });
        setState((current) => (current ? { ...current, assignments: result.assignments } : current));
      });
    },
    [date, guarded, state],
  );

  const copySheet = useCallback(
    async (fromDate: string) => {
      await guarded(async () => {
        await request("/api/rd2/assignments", {
          method: "POST",
          body: JSON.stringify({ op: "copy", fromDate, toDate: date }),
        });
        await load(date);
      }, "Розстановку скопійовано");
    },
    [date, guarded, load],
  );

  const clearSheet = useCallback(async () => {
    await guarded(async () => {
      await request("/api/rd2/assignments", { method: "POST", body: JSON.stringify({ op: "clear", date }) });
      await load(date);
    }, "Розстановку очищено");
  }, [date, guarded, load]);

  const seedFromSheet = useCallback(
    () =>
      guarded(async () => {
        const result = await request<{ date: string }>("/api/rd2/seed", { method: "POST" });
        setDateValue(result.date);
        await load(result.date);
      }, "Бланк 07.09.26 завантажено"),
    [guarded, load],
  );

  const addEmployee = useCallback(
    (input: Partial<Employee>) =>
      guarded(async () => {
        await request("/api/rd2/employees", { method: "POST", body: JSON.stringify(input) });
        await load(date);
      }, "Співробітника додано"),
    [date, guarded, load],
  );

  const patchEmployee = useCallback(
    (id: number, input: Partial<Employee>) =>
      guarded(async () => {
        await request(`/api/rd2/employees/${id}`, { method: "PATCH", body: JSON.stringify(input) });
        await load(date);
      }, "Дані оновлено"),
    [date, guarded, load],
  );

  const removeEmployee = useCallback(
    (id: number) =>
      guarded(async () => {
        await request(`/api/rd2/employees/${id}`, { method: "DELETE" });
        await load(date);
      }, "Співробітника видалено"),
    [date, guarded, load],
  );

  const patchPosition = useCallback(
    (id: number, input: Partial<Position>) =>
      guarded(async () => {
        await request(`/api/rd2/positions/${id}`, { method: "PATCH", body: JSON.stringify(input) });
        await load(date);
      }, "Посаду оновлено"),
    [date, guarded, load],
  );

  const addAbsence = useCallback(
    (input: Partial<Absence>) =>
      guarded(async () => {
        await request("/api/rd2/absences", { method: "POST", body: JSON.stringify(input) });
        await load(date);
      }, "Запис додано"),
    [date, guarded, load],
  );

  const patchAbsence = useCallback(
    (id: number, input: Partial<Absence>) =>
      guarded(async () => {
        await request(`/api/rd2/absences/${id}`, { method: "PATCH", body: JSON.stringify(input) });
        await load(date);
      }, "Запис оновлено"),
    [date, guarded, load],
  );

  const removeAbsence = useCallback(
    (id: number) =>
      guarded(async () => {
        await request(`/api/rd2/absences/${id}`, { method: "DELETE" });
        await load(date);
      }, "Запис видалено"),
    [date, guarded, load],
  );

  const value = useMemo<Rd2Context>(
    () => ({
      state,
      loading,
      saving,
      status,
      date,
      setDate,
      notify,
      refresh: () => load(date),
      writeCells,
      copySheet,
      clearSheet,
      seedFromSheet,
      addEmployee,
      patchEmployee,
      removeEmployee,
      patchPosition,
      addAbsence,
      patchAbsence,
      removeAbsence,
    }),
    [
      addAbsence, addEmployee, clearSheet, copySheet, date, load, loading, notify, patchAbsence,
      patchEmployee, patchPosition, removeAbsence, removeEmployee, saving, seedFromSheet, setDate, state, status, writeCells,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRd2() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useRd2 must be used inside Rd2Provider");
  return ctx;
}

export type { CellWrite };
