"use client";

import { useState } from "react";
import {
  ABSENCE_META,
  ABSENCE_ORDER,
  MONTHS,
  WEEKDAYS,
  daysInMonth,
  formatShort,
  isoOf,
  todayIso,
  weekdayIndex,
  type Absence,
  type AbsenceKind,
  type Employee,
} from "../lib/model";
import { useRd2 } from "../lib/store";

type View = "timeline" | "month";

export default function CalendarPage() {
  const { state, loading, date, setDate } = useRd2();
  const [year, setYear] = useState(() => Number(date.slice(0, 4)));
  const [month, setMonth] = useState(() => Number(date.slice(5, 7)) - 1);
  const [view, setView] = useState<View>("timeline");
  const [positionFilter, setPositionFilter] = useState<number | 0>(0);
  const [kindFilter, setKindFilter] = useState<AbsenceKind | "all">("all");
  const [onlyAbsent, setOnlyAbsent] = useState(true);

  const total = daysInMonth(year, month);
  const monthStart = isoOf(year, month, 1);
  const monthEnd = isoOf(year, month, total);
  const today = todayIso();

  const employeeById = new Map<number, Employee>();
  for (const employee of state?.employees ?? []) employeeById.set(employee.id, employee);

  const monthAbsences = (state?.absences ?? []).filter((absence) => {
    if (absence.endDate < monthStart || absence.startDate > monthEnd) return false;
    if (kindFilter !== "all" && absence.kind !== kindFilter) return false;
    const employee = employeeById.get(absence.employeeId);
    if (positionFilter && employee?.positionId !== positionFilter) return false;
    return true;
  });

  const byEmployee = new Map<number, Absence[]>();
  for (const absence of monthAbsences) {
    const list = byEmployee.get(absence.employeeId) ?? [];
    list.push(absence);
    byEmployee.set(absence.employeeId, list);
  }

  function step(delta: number) {
    const next = new Date(year, month + delta, 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth());
  }

  const groups = (state?.positions ?? [])
    .filter((position) => !positionFilter || position.id === positionFilter)
    .map((position) => ({
      position,
      people: (state?.employees ?? [])
        .filter((employee) => employee.positionId === position.id)
        .filter((employee) => !onlyAbsent || byEmployee.has(employee.id)),
    }))
    .filter((group) => group.people.length > 0);

  return (
    <>
      <header className="rd2-topbar">
        <div className="rd2-title">
          <h1>
            Календар відпусток — {MONTHS[month]} {year}
          </h1>
          <span>Записів у місяці: {monthAbsences.length}</span>
        </div>

        <span className="rd2-topbar-spacer" />

        <div className="rd2-datenav">
          <button type="button" className="rd2-iconbtn" aria-label="Попередній місяць" onClick={() => step(-1)}>
            ‹
          </button>
          <input
            type="month"
            value={`${year}-${String(month + 1).padStart(2, "0")}`}
            aria-label="Місяць"
            onChange={(event) => {
              if (!event.target.value) return;
              const [nextYear, nextMonth] = event.target.value.split("-").map(Number);
              setYear(nextYear);
              setMonth(nextMonth - 1);
            }}
          />
          <button type="button" className="rd2-iconbtn" aria-label="Наступний місяць" onClick={() => step(1)}>
            ›
          </button>
        </div>

        <select
          className="rd2-btn rd2-btn-sm"
          value={positionFilter}
          aria-label="Фільтр за посадою"
          onChange={(event) => setPositionFilter(Number(event.target.value))}
        >
          <option value={0}>Усі посади</option>
          {(state?.positions ?? []).map((position) => (
            <option key={position.id} value={position.id}>
              {position.label}
            </option>
          ))}
        </select>

        <select
          className="rd2-btn rd2-btn-sm"
          value={kindFilter}
          aria-label="Фільтр за видом"
          onChange={(event) => setKindFilter(event.target.value as AbsenceKind | "all")}
        >
          <option value="all">Усі види</option>
          {ABSENCE_ORDER.map((kind) => (
            <option key={kind} value={kind}>
              {ABSENCE_META[kind].label}
            </option>
          ))}
        </select>

        <button type="button" className="rd2-btn rd2-btn-sm" onClick={() => setView(view === "timeline" ? "month" : "timeline")}>
          {view === "timeline" ? "Вигляд: стрічка" : "Вигляд: сітка"}
        </button>
      </header>

      <main className="rd2-content">
        {loading && <div className="rd2-skeleton" />}
        {!loading && !state && <div className="rd2-note">База даних недоступна — календар не може завантажити записи.</div>}

        {!loading && state && (
          <div className="rd2-card">
            <div className="rd2-card-head">
              <h2>{view === "timeline" ? "Стрічка відсутностей" : "Місячна сітка"}</h2>
              <span className="rd2-spacer" />
              <div className="rd2-legend">
                {ABSENCE_ORDER.map((kind) => (
                  <span key={kind}>
                    <i style={{ background: ABSENCE_META[kind].color }} />
                    {ABSENCE_META[kind].label}
                  </span>
                ))}
              </div>
              {view === "timeline" && (
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, textTransform: "none", letterSpacing: 0, margin: 0, fontWeight: 500 }}>
                  <input type="checkbox" checked={onlyAbsent} onChange={(event) => setOnlyAbsent(event.target.checked)} style={{ width: 14, height: 14 }} />
                  Лише відсутні
                </label>
              )}
            </div>

            {view === "timeline" ? (
              <div className="rd2-scroll">
                <table className="rd2-timeline">
                  <thead>
                    <tr>
                      <th className="rd2-tl-name">Співробітник</th>
                      {Array.from({ length: total }, (_, index) => {
                        const day = index + 1;
                        const weekend = weekdayIndex(year, month, day) >= 5;
                        return (
                          <th key={day} data-weekend={weekend} data-today={isoOf(year, month, day) === today}>
                            {day}
                            <small>{WEEKDAYS[weekdayIndex(year, month, day)]}</small>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {groups.length === 0 && (
                      <tr>
                        <td className="rd2-tl-name" colSpan={total + 1}>
                          <div className="rd2-empty">У цьому місяці записів немає</div>
                        </td>
                      </tr>
                    )}
                    {groups.map((group) => (
                      <TimelineGroup
                        key={group.position.id}
                        label={`${group.position.label} · ${group.position.quota}`}
                        people={group.people}
                        year={year}
                        month={month}
                        total={total}
                        today={today}
                        byEmployee={byEmployee}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rd2-card-body">
                <MonthGrid
                  year={year}
                  month={month}
                  total={total}
                  today={today}
                  absences={monthAbsences}
                  employeeById={employeeById}
                  onPick={(iso) => setDate(iso)}
                  activeDate={date}
                />
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}

function TimelineGroup({
  label,
  people,
  year,
  month,
  total,
  today,
  byEmployee,
}: {
  label: string;
  people: Employee[];
  year: number;
  month: number;
  total: number;
  today: string;
  byEmployee: Map<number, Absence[]>;
}) {
  return (
    <>
      <tr className="rd2-tl-group">
        <td colSpan={total + 1}>{label}</td>
      </tr>
      {people.map((employee) => {
        const list = byEmployee.get(employee.id) ?? [];
        return (
          <tr key={employee.id}>
            <td className="rd2-tl-name">
              <b>{employee.fullName}</b>
              <span>
                {employee.staffGroup === "day" ? "Денний" : "Змінний"}
                {list.length > 0 ? ` · ${list.map((item) => `${formatShort(item.startDate)}–${formatShort(item.endDate)}`).join(", ")}` : ""}
              </span>
            </td>
            {Array.from({ length: total }, (_, index) => {
              const day = index + 1;
              const iso = isoOf(year, month, day);
              const absence = list.find((item) => item.startDate <= iso && item.endDate >= iso);
              const weekend = weekdayIndex(year, month, day) >= 5;
              return (
                <td key={day} className="rd2-tl-day" data-weekend={weekend} data-today={iso === today}>
                  {absence && (
                    <div
                      className="rd2-bar"
                      style={{ background: ABSENCE_META[absence.kind].color }}
                      data-start={absence.startDate === iso}
                      data-end={absence.endDate === iso}
                      title={`${employee.fullName}: ${ABSENCE_META[absence.kind].label} ${formatShort(absence.startDate)} – ${formatShort(absence.endDate)}`}
                    />
                  )}
                </td>
              );
            })}
          </tr>
        );
      })}
    </>
  );
}

function MonthGrid({
  year,
  month,
  total,
  today,
  absences,
  employeeById,
  onPick,
  activeDate,
}: {
  year: number;
  month: number;
  total: number;
  today: string;
  absences: Absence[];
  employeeById: Map<number, Employee>;
  onPick: (iso: string) => void;
  activeDate: string;
}) {
  const offset = weekdayIndex(year, month, 1);
  const cells: (number | null)[] = [...Array.from({ length: offset }, () => null), ...Array.from({ length: total }, (_, index) => index + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="rd2-month">
      {WEEKDAYS.map((day) => (
        <div className="rd2-month-head" key={day}>
          {day}
        </div>
      ))}
      {cells.map((day, index) => {
        if (day === null) return <div className="rd2-day" data-muted="true" key={`empty-${index}`} />;
        const iso = isoOf(year, month, day);
        const dayAbsences = absences.filter((absence) => absence.startDate <= iso && absence.endDate >= iso);
        const weekend = index % 7 >= 5;
        return (
          <div
            className="rd2-day"
            key={iso}
            data-weekend={weekend}
            data-today={iso === today || iso === activeDate}
            role="button"
            tabIndex={0}
            title={`Відкрити розстановку на ${formatShort(iso)}`}
            onClick={() => onPick(iso)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") onPick(iso);
            }}
          >
            <div className="rd2-day-num">
              {day}
              {dayAbsences.length > 0 && <em>{dayAbsences.length}</em>}
            </div>
            {dayAbsences.slice(0, 4).map((absence) => (
              <div className="rd2-day-item" key={absence.id} style={{ background: ABSENCE_META[absence.kind].color }}>
                {employeeById.get(absence.employeeId)?.fullName ?? `#${absence.employeeId}`}
              </div>
            ))}
            {dayAbsences.length > 4 && <div className="rd2-day-more">ще {dayAbsences.length - 4}</div>}
          </div>
        );
      })}
    </div>
  );
}
