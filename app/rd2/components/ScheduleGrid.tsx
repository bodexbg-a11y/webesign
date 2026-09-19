"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { beginDrag, currentDrag, endDrag, readDrag, type DragSource } from "../lib/dnd";
import {
  ABSENCE_META,
  ALL_COLUMNS,
  EXTRA_COLUMNS,
  SHIFT_COLUMNS,
  cellKey,
  coversDate,
  type ColumnCode,
  type Employee,
  type RowKind,
} from "../lib/model";
import { useRd2, type CellWrite } from "../lib/store";

type CellItems = Map<string, { positionId: number; columnCode: ColumnCode; rowKind: RowKind; items: { employeeId: number; note: string }[] }>;

const ROWS: { kind: RowKind; label: string }[] = [
  { kind: "main", label: "" },
  { kind: "trainee", label: "Ст/Дубл" },
];

export default function ScheduleGrid() {
  const { state, date, writeCells, patchPosition } = useRd2();
  const [openPicker, setOpenPicker] = useState<string | null>(null);
  const [overKey, setOverKey] = useState<string | null>(null);
  const [dragKey, setDragKey] = useState<string | null>(null);
  const pickerRef = useRef<HTMLSelectElement | null>(null);

  useEffect(() => {
    if (openPicker) pickerRef.current?.focus();
  }, [openPicker]);

  const employeeById = useMemo(() => {
    const map = new Map<number, Employee>();
    for (const employee of state?.employees ?? []) map.set(employee.id, employee);
    return map;
  }, [state?.employees]);

  const absentToday = useMemo(() => {
    const map = new Map<number, string>();
    for (const absence of state?.absences ?? []) {
      if (coversDate(absence, date)) map.set(absence.employeeId, ABSENCE_META[absence.kind].label);
    }
    return map;
  }, [date, state?.absences]);

  const cells = useMemo<CellItems>(() => {
    const map: CellItems = new Map();
    for (const row of state?.assignments ?? []) {
      const key = cellKey(row.positionId, row.columnCode, row.rowKind);
      const bucket = map.get(key) ?? { positionId: row.positionId, columnCode: row.columnCode, rowKind: row.rowKind, items: [] };
      bucket.items.push({ employeeId: row.employeeId, note: row.note });
      map.set(key, bucket);
    }
    return map;
  }, [state?.assignments]);

  if (!state) return null;

  /** Переносить співробітника в цільову клітинку, прибираючи його з усіх інших. */
  function apply(employeeId: number, target: { positionId: number; columnCode: ColumnCode; rowKind: RowKind } | null, insertAt?: number) {
    const changed = new Map<string, CellWrite>();
    const next = new Map<string, { employeeId: number; note: string }[]>();
    let carriedNote = "";

    for (const [key, cell] of cells) {
      const kept = cell.items.filter((item) => {
        if (item.employeeId !== employeeId) return true;
        carriedNote = item.note;
        return false;
      });
      next.set(key, kept);
      if (kept.length !== cell.items.length) {
        changed.set(key, { positionId: cell.positionId, columnCode: cell.columnCode, rowKind: cell.rowKind, items: kept });
      }
    }

    if (target) {
      const key = cellKey(target.positionId, target.columnCode, target.rowKind);
      const items = [...(next.get(key) ?? [])];
      const index = insertAt === undefined || insertAt < 0 || insertAt > items.length ? items.length : insertAt;
      items.splice(index, 0, { employeeId, note: carriedNote });
      changed.set(key, { ...target, items });
    }

    if (changed.size > 0) void writeCells([...changed.values()]);
  }

  function onDrop(event: React.DragEvent, target: { positionId: number; columnCode: ColumnCode; rowKind: RowKind }, insertAt?: number) {
    event.preventDefault();
    event.stopPropagation();
    setOverKey(null);
    const payload = readDrag(event);
    endDrag();
    setDragKey(null);
    if (!payload) return;
    apply(payload.employeeId, target, insertAt);
  }

  const columnCounts = ALL_COLUMNS.map((column) => ({
    code: column.code,
    label: column.label,
    count: state.assignments.filter((row) => row.columnCode === column.code).length,
  }));

  return (
    <div className="rd2-card">
      <div className="rd2-card-head">
        <h2>Розстановка персоналу РЦ-2</h2>
        <p>Перетягніть прізвище між клітинками, щоб змінити зміну.</p>
        <span className="rd2-spacer" />
        <div className="rd2-stats">
          {columnCounts.map((column) => (
            <div className="rd2-stat" key={column.code} style={{ minWidth: 62 }}>
              <span>{column.label}</span>
              <b>{column.count}</b>
            </div>
          ))}
        </div>
      </div>

      <div className="rd2-scroll">
        <table className="rd2-grid">
          <thead>
            <tr>
              <th className="rd2-rowhead">Зміна</th>
              {SHIFT_COLUMNS.map((column) => (
                <th key={column.code}>{column.label}</th>
              ))}
              {EXTRA_COLUMNS.map((column) => (
                <th key={column.code} data-kind="extra">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {state.positions.map((position) =>
              ROWS.map((row) => (
                <tr key={`${position.id}-${row.kind}`} data-row={row.kind}>
                  <td className="rd2-rowhead">
                    {row.kind === "main" ? (
                      <>
                        <b>{position.label}</b>
                        <input
                          defaultValue={position.quota}
                          aria-label={`Норматив ${position.label}`}
                          onBlur={(event) => {
                            const value = event.target.value.trim();
                            if (value !== position.quota) void patchPosition(position.id, { quota: value });
                          }}
                        />
                      </>
                    ) : (
                      <span>{row.label}</span>
                    )}
                  </td>

                  {ALL_COLUMNS.map((column) => {
                    const target = { positionId: position.id, columnCode: column.code, rowKind: row.kind };
                    const key = cellKey(position.id, column.code, row.kind);
                    const items = cells.get(key)?.items ?? [];
                    const isExtra = EXTRA_COLUMNS.some((extra) => extra.code === column.code);

                    return (
                      <td
                        key={column.code}
                        className="rd2-cell"
                        data-extra={isExtra}
                        data-empty={items.length === 0}
                        data-over={overKey === key && currentDrag() !== null}
                        onDragOver={(event) => {
                          event.preventDefault();
                          event.dataTransfer.dropEffect = "move";
                          if (overKey !== key) setOverKey(key);
                        }}
                        onDragLeave={() => setOverKey((value) => (value === key ? null : value))}
                        onDrop={(event) => onDrop(event, target)}
                      >
                        <div className="rd2-cell-stack">
                          {items.map((item, index) => {
                            const employee = employeeById.get(item.employeeId);
                            const absence = absentToday.get(item.employeeId);
                            const chipKey = `${key}:${item.employeeId}`;
                            const source: DragSource = target;
                            return (
                              <div
                                key={item.employeeId}
                                className="rd2-chip"
                                draggable
                                data-dragging={dragKey === chipKey}
                                data-absent={Boolean(absence)}
                                title={absence ? `${employee?.fullName ?? "?"} — ${absence}` : employee?.fullName ?? "Невідомий"}
                                onDragStart={(event) => {
                                  setDragKey(chipKey);
                                  beginDrag(event, { employeeId: item.employeeId, from: source });
                                }}
                                onDragEnd={() => {
                                  setDragKey(null);
                                  endDrag();
                                }}
                                onDrop={(event) => onDrop(event, target, index)}
                              >
                                <span className="rd2-chip-dot" style={absence ? { background: "#c0392b" } : undefined} />
                                <span className="rd2-chip-name">{employee?.fullName ?? `#${item.employeeId}`}</span>
                                {employee?.tag && <span className="rd2-chip-tag">{employee.tag}</span>}
                                <button
                                  type="button"
                                  className="rd2-chip-x"
                                  aria-label="Прибрати з клітинки"
                                  onClick={() => apply(item.employeeId, null)}
                                >
                                  ✕
                                </button>
                                {absence && <span className="rd2-chip-warn">{absence}</span>}
                              </div>
                            );
                          })}

                          {openPicker === key ? (
                            <div className="rd2-picker">
                              <select
                                ref={pickerRef}
                                defaultValue=""
                                aria-label="Обрати співробітника"
                                onBlur={() => setOpenPicker(null)}
                                onChange={(event) => {
                                  const employeeId = Number(event.target.value);
                                  setOpenPicker(null);
                                  if (employeeId) apply(employeeId, target);
                                }}
                              >
                                <option value="">— оберіть —</option>
                                {state.positions.map((group) => (
                                  <optgroup key={group.id} label={group.label}>
                                    {state.employees
                                      .filter((employee) => employee.positionId === group.id)
                                      .map((employee) => (
                                        <option key={employee.id} value={employee.id}>
                                          {employee.fullName}
                                          {employee.tag ? ` ${employee.tag}` : ""}
                                        </option>
                                      ))}
                                  </optgroup>
                                ))}
                              </select>
                            </div>
                          ) : (
                            <button type="button" className="rd2-add" onClick={() => setOpenPicker(key)}>
                              ＋
                            </button>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
