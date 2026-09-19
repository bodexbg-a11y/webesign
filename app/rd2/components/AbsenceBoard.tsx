"use client";

import { useMemo, useState } from "react";
import {
  ABSENCE_META,
  ABSENCE_ORDER,
  coversDate,
  formatShort,
  type Absence,
  type AbsenceKind,
  type Employee,
} from "../lib/model";
import { useRd2 } from "../lib/store";
import Modal from "./Modal";

type Row = { absence: Absence; employee: Employee | undefined };

export default function AbsenceBoard() {
  const { state, date, addAbsence, removeAbsence } = useRd2();
  const [showArchive, setShowArchive] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  const byId = useMemo(() => {
    const map = new Map<number, Employee>();
    for (const employee of state?.employees ?? []) map.set(employee.id, employee);
    return map;
  }, [state?.employees]);

  const rows = useMemo<Row[]>(() => {
    const all = (state?.absences ?? []).map((absence) => ({ absence, employee: byId.get(absence.employeeId) }));
    const visible = showArchive ? all : all.filter((row) => row.absence.endDate >= date);
    return visible.sort((a, b) => a.absence.startDate.localeCompare(b.absence.startDate));
  }, [byId, date, showArchive, state?.absences]);

  if (!state) return null;

  const shiftRows = rows.filter((row) => row.employee?.staffGroup !== "day");
  const dayRows = rows.filter((row) => row.employee?.staffGroup === "day");
  const activeToday = rows.filter((row) => coversDate(row.absence, date)).length;

  return (
    <>
      <div className="rd2-card">
        <div className="rd2-card-head">
          <h2>Відпустки, лікарняні, відрядження</h2>
          <p>
            Активних на {formatShort(date)}: <b>{activeToday}</b>
          </p>
          <span className="rd2-spacer" />
          <div className="rd2-legend">
            {ABSENCE_ORDER.map((kind) => (
              <span key={kind}>
                <i style={{ background: ABSENCE_META[kind].color }} />
                {ABSENCE_META[kind].label}
              </span>
            ))}
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, textTransform: "none", letterSpacing: 0, margin: 0, fontWeight: 500 }}>
            <input type="checkbox" checked={showArchive} onChange={(event) => setShowArchive(event.target.checked)} style={{ width: 14, height: 14 }} />
            Показати архів
          </label>
          <button type="button" className="rd2-btn rd2-btn-sm" data-variant="primary" onClick={() => setFormOpen(true)}>
            ＋ Запис
          </button>
        </div>

        <div className="rd2-card-body">
          <div className="rd2-split">
            <AbsenceTable title="Змінний персонал" rows={shiftRows} positions={state.positions} onDelete={removeAbsence} sheetDate={date} />
            <AbsenceTable title="Денний персонал" rows={dayRows} positions={state.positions} onDelete={removeAbsence} sheetDate={date} />
          </div>
        </div>
      </div>

      {formOpen && <AbsenceDialog onClose={() => setFormOpen(false)} onSubmit={addAbsence} />}
    </>
  );
}

function AbsenceTable({
  title,
  rows,
  positions,
  onDelete,
  sheetDate,
}: {
  title: string;
  rows: Row[];
  positions: { id: number; label: string }[];
  onDelete: (id: number) => Promise<boolean>;
  sheetDate: string;
}) {
  const positionLabel = new Map(positions.map((position) => [position.id, position.label]));

  return (
    <div>
      <h3 style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".09em", color: "#8b96a8", marginBottom: 8 }}>{title}</h3>
      {rows.length === 0 ? (
        <div className="rd2-empty">Записів немає</div>
      ) : (
        <table className="rd2-list">
          <thead>
            <tr>
              <th>Посада</th>
              <th>П.І.Б.</th>
              <th>Вид</th>
              <th>з</th>
              <th>по</th>
              <th aria-label="Дії" />
            </tr>
          </thead>
          <tbody>
            {rows.map(({ absence, employee }) => (
              <tr key={absence.id} style={coversDate(absence, sheetDate) ? { background: "#fbfdff" } : undefined}>
                <td className="rd2-pos-cell">{employee ? positionLabel.get(employee.positionId) ?? "—" : "—"}</td>
                <td>
                  {employee?.fullName ?? `#${absence.employeeId}`}
                  {absence.note && <div style={{ fontSize: 11, color: "#8b96a8" }}>{absence.note}</div>}
                </td>
                <td>
                  <span className="rd2-kind" style={{ background: ABSENCE_META[absence.kind].color }}>
                    {ABSENCE_META[absence.kind].short}
                  </span>
                </td>
                <td>{formatShort(absence.startDate)}</td>
                <td>{formatShort(absence.endDate)}</td>
                <td style={{ textAlign: "right" }}>
                  <button
                    type="button"
                    className="rd2-iconbtn"
                    aria-label="Видалити запис"
                    onClick={() => {
                      if (window.confirm("Видалити запис?")) void onDelete(absence.id);
                    }}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function AbsenceDialog({ onClose, onSubmit }: { onClose: () => void; onSubmit: (input: Partial<Absence>) => Promise<boolean> }) {
  const { state, date } = useRd2();
  const [employeeId, setEmployeeId] = useState<number>(state?.employees[0]?.id ?? 0);
  const [kind, setKind] = useState<AbsenceKind>("vacation");
  const [startDate, setStartDate] = useState(date);
  const [endDate, setEndDate] = useState(date);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  if (!state) return null;
  const invalid = !employeeId || !startDate || !endDate || endDate < startDate;

  return (
    <Modal
      title="Новий запис відсутності"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="rd2-btn" onClick={onClose} disabled={busy}>
            Скасувати
          </button>
          <button
            type="button"
            className="rd2-btn"
            data-variant="primary"
            disabled={busy || invalid}
            onClick={async () => {
              setBusy(true);
              const done = await onSubmit({ employeeId, kind, startDate, endDate, note });
              setBusy(false);
              if (done) onClose();
            }}
          >
            Додати
          </button>
        </>
      }
    >
      <div className="rd2-field">
        <label htmlFor="rd2-abs-emp">Співробітник</label>
        <select id="rd2-abs-emp" value={employeeId} onChange={(event) => setEmployeeId(Number(event.target.value))}>
          {state.positions.map((position) => (
            <optgroup key={position.id} label={position.label}>
              {state.employees
                .filter((employee) => employee.positionId === position.id)
                .map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.fullName}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="rd2-form-grid">
        <div className="rd2-field">
          <label htmlFor="rd2-abs-kind">Вид</label>
          <select id="rd2-abs-kind" value={kind} onChange={(event) => setKind(event.target.value as AbsenceKind)}>
            {ABSENCE_ORDER.map((value) => (
              <option key={value} value={value}>
                {ABSENCE_META[value].label}
              </option>
            ))}
          </select>
        </div>
        <div className="rd2-field">
          <label htmlFor="rd2-abs-from">з</label>
          <input id="rd2-abs-from" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
        </div>
        <div className="rd2-field">
          <label htmlFor="rd2-abs-to">по</label>
          <input id="rd2-abs-to" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
        </div>
      </div>

      {endDate < startDate && <p style={{ color: "#c0392b", fontSize: 12 }}>Дата «по» раніше за дату «з».</p>}

      <div className="rd2-field">
        <label htmlFor="rd2-abs-note">Примітка</label>
        <input id="rd2-abs-note" value={note} onChange={(event) => setNote(event.target.value)} />
      </div>
    </Modal>
  );
}
