"use client";

import { useEffect, useRef, useState } from "react";
import type { Employee, Position } from "../lib/model";
import Modal from "./Modal";

export type EmployeeDraft = {
  fullName: string;
  positionId: number;
  staffGroup: "shift" | "day";
  rank: "main" | "trainee";
  tag: string;
  phone: string;
  note: string;
};

export default function EmployeeDialog({
  employee,
  positions,
  defaultPositionId,
  onSubmit,
  onDelete,
  onClose,
}: {
  employee: Employee | null;
  positions: Position[];
  defaultPositionId: number;
  onSubmit: (draft: EmployeeDraft) => Promise<boolean>;
  onDelete?: () => Promise<boolean>;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<EmployeeDraft>({
    fullName: employee?.fullName ?? "",
    positionId: employee?.positionId ?? defaultPositionId,
    staffGroup: employee?.staffGroup ?? "shift",
    rank: employee?.rank ?? "main",
    tag: employee?.tag ?? "",
    phone: employee?.phone ?? "",
    note: employee?.note ?? "",
  });
  const [busy, setBusy] = useState(false);
  const nameRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  function set<K extends keyof EmployeeDraft>(key: K, value: EmployeeDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function submit() {
    if (!draft.fullName.trim()) return;
    setBusy(true);
    const done = await onSubmit({ ...draft, fullName: draft.fullName.trim() });
    setBusy(false);
    if (done) onClose();
  }

  return (
    <Modal
      title={employee ? "Картка співробітника" : "Новий співробітник"}
      onClose={onClose}
      footer={
        <>
          {employee && onDelete && (
            <button
              type="button"
              className="rd2-btn"
              data-variant="danger"
              style={{ marginRight: "auto" }}
              disabled={busy}
              onClick={async () => {
                if (!window.confirm(`Видалити ${employee.fullName}? Разом із записами розстановки й відпусток.`)) return;
                setBusy(true);
                const done = await onDelete();
                setBusy(false);
                if (done) onClose();
              }}
            >
              Видалити
            </button>
          )}
          <button type="button" className="rd2-btn" onClick={onClose} disabled={busy}>
            Скасувати
          </button>
          <button type="button" className="rd2-btn" data-variant="primary" onClick={submit} disabled={busy || !draft.fullName.trim()}>
            {employee ? "Зберегти" : "Додати"}
          </button>
        </>
      }
    >
      <div className="rd2-field">
        <label htmlFor="rd2-emp-name">П.І.Б.</label>
        <input
          id="rd2-emp-name"
          ref={nameRef}
          value={draft.fullName}
          placeholder="Петренко С.О."
          onChange={(event) => set("fullName", event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") void submit();
          }}
        />
      </div>

      <div className="rd2-form-grid">
        <div className="rd2-field">
          <label htmlFor="rd2-emp-pos">Посада</label>
          <select id="rd2-emp-pos" value={draft.positionId} onChange={(event) => set("positionId", Number(event.target.value))}>
            {positions.map((position) => (
              <option key={position.id} value={position.id}>
                {position.label}
              </option>
            ))}
          </select>
        </div>
        <div className="rd2-field">
          <label htmlFor="rd2-emp-group">Група</label>
          <select
            id="rd2-emp-group"
            value={draft.staffGroup}
            onChange={(event) => set("staffGroup", event.target.value as EmployeeDraft["staffGroup"])}
          >
            <option value="shift">Змінний персонал</option>
            <option value="day">Денний персонал</option>
          </select>
        </div>
        <div className="rd2-field">
          <label htmlFor="rd2-emp-rank">Статус</label>
          <select id="rd2-emp-rank" value={draft.rank} onChange={(event) => set("rank", event.target.value as EmployeeDraft["rank"])}>
            <option value="main">Основний</option>
            <option value="trainee">Стажер / дублер</option>
          </select>
        </div>
      </div>

      <div className="rd2-form-grid">
        <div className="rd2-field">
          <label htmlFor="rd2-emp-tag">Позначка</label>
          <input id="rd2-emp-tag" value={draft.tag} placeholder="(21)" onChange={(event) => set("tag", event.target.value)} />
        </div>
        <div className="rd2-field">
          <label htmlFor="rd2-emp-phone">Телефон</label>
          <input id="rd2-emp-phone" value={draft.phone} onChange={(event) => set("phone", event.target.value)} />
        </div>
      </div>

      <div className="rd2-field">
        <label htmlFor="rd2-emp-note">Примітка</label>
        <textarea id="rd2-emp-note" rows={2} value={draft.note} onChange={(event) => set("note", event.target.value)} />
      </div>
    </Modal>
  );
}
