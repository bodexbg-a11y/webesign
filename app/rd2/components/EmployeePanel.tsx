"use client";

import { useMemo, useState } from "react";
import { beginDrag, endDrag } from "../lib/dnd";
import { initials, type Employee } from "../lib/model";
import { useRd2 } from "../lib/store";
import EmployeeDialog, { type EmployeeDraft } from "./EmployeeDialog";

export default function EmployeePanel() {
  const { state, addEmployee, patchEmployee, removeEmployee } = useRd2();
  const [query, setQuery] = useState("");
  const [dialog, setDialog] = useState<{ open: boolean; employee: Employee | null }>({ open: false, employee: null });
  const [dragId, setDragId] = useState<number | null>(null);

  const assignedIds = useMemo(
    () => new Set((state?.assignments ?? []).map((row) => row.employeeId)),
    [state?.assignments],
  );

  const groups = useMemo(() => {
    if (!state) return [];
    const needle = query.trim().toLowerCase();
    return state.positions.map((position) => ({
      position,
      people: state.employees
        .filter((employee) => employee.positionId === position.id)
        .filter((employee) => !needle || employee.fullName.toLowerCase().includes(needle)),
    }));
  }, [query, state]);

  const total = state?.employees.length ?? 0;
  const shown = groups.reduce((sum, group) => sum + group.people.length, 0);

  return (
    <>
      <div className="rd2-aside-body">
        <div className="rd2-aside-head">
          <h2>Співробітники</h2>
          <b>{query ? `${shown} / ${total}` : total}</b>
        </div>

        <input
          className="rd2-search"
          value={query}
          placeholder="Пошук за прізвищем…"
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Пошук співробітника"
        />

        <button type="button" className="rd2-btn rd2-btn-sm" onClick={() => setDialog({ open: true, employee: null })}>
          ＋ Додати співробітника
        </button>

        {!state && <p style={{ color: "#7d8ba1", fontSize: 12, padding: "8px 4px" }}>Дані недоступні.</p>}

        {groups.map(({ position, people }) => (
          <div className="rd2-group" key={position.id}>
            <h3>
              {position.label}
              <em>{people.length}</em>
            </h3>
            {people.length === 0 && (
              <p style={{ color: "#6d7a90", fontSize: 11.5, padding: "2px 6px 6px" }}>Порожньо</p>
            )}
            {people.map((employee) => (
              <div
                key={employee.id}
                className="rd2-person"
                draggable
                data-dragging={dragId === employee.id}
                data-assigned={assignedIds.has(employee.id)}
                title={`${employee.fullName}${employee.note ? ` — ${employee.note}` : ""}`}
                onDragStart={(event) => {
                  setDragId(employee.id);
                  beginDrag(event, { employeeId: employee.id, from: null });
                }}
                onDragEnd={() => {
                  setDragId(null);
                  endDrag();
                }}
              >
                <span className="rd2-avatar">{initials(employee.fullName)}</span>
                <span className="rd2-person-text">
                  <b>{employee.fullName}</b>
                  <span>
                    {employee.staffGroup === "day" ? "Денний" : "Змінний"}
                    {employee.rank === "trainee" ? " · дублер" : ""}
                    {employee.tag ? ` · ${employee.tag}` : ""}
                  </span>
                </span>
                <button
                  type="button"
                  className="rd2-person-act"
                  aria-label={`Редагувати ${employee.fullName}`}
                  onClick={() => setDialog({ open: true, employee })}
                >
                  ✎
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="rd2-aside-foot">
        <p style={{ fontSize: 11, color: "#7d8ba1" }}>
          Перетягніть прізвище у клітинку графіка або скористайтесь випадним списком у клітинці.
        </p>
      </div>

      {dialog.open && state && (
        <EmployeeDialog
          employee={dialog.employee}
          positions={state.positions}
          defaultPositionId={state.positions[0]?.id ?? 0}
          onClose={() => setDialog({ open: false, employee: null })}
          onSubmit={(draft: EmployeeDraft) =>
            dialog.employee ? patchEmployee(dialog.employee.id, draft) : addEmployee(draft)
          }
          onDelete={dialog.employee ? () => removeEmployee(dialog.employee!.id) : undefined}
        />
      )}
    </>
  );
}
