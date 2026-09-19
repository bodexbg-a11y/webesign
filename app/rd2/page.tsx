"use client";

import { formatLong, shiftIsoDay, todayIso } from "./lib/model";
import { useRd2 } from "./lib/store";
import AbsenceBoard from "./components/AbsenceBoard";
import ScheduleGrid from "./components/ScheduleGrid";

export default function SchedulePage() {
  const { state, loading, saving, date, setDate, copySheet, clearSheet, refresh, seedFromSheet } = useRd2();
  const previousDay = shiftIsoDay(date, -1);
  const sheetDates = state?.sheetDates ?? [];
  const hasPrevious = sheetDates.includes(previousDay);
  const latestSheet = sheetDates.filter((iso) => iso !== date).at(-1) ?? "";

  return (
    <>
      <header className="rd2-topbar">
        <div className="rd2-title">
          <h1>Графік — розстановка на {formatLong(date)}</h1>
          <span>{saving ? "Збереження…" : loading ? "Завантаження…" : "Усі зміни збережено"}</span>
        </div>

        <span className="rd2-topbar-spacer" />

        <div className="rd2-datenav">
          <button type="button" className="rd2-iconbtn" aria-label="Попередній день" onClick={() => setDate(shiftIsoDay(date, -1))}>
            ‹
          </button>
          <input type="date" value={date} aria-label="Дата розстановки" onChange={(event) => event.target.value && setDate(event.target.value)} />
          <button type="button" className="rd2-iconbtn" aria-label="Наступний день" onClick={() => setDate(shiftIsoDay(date, 1))}>
            ›
          </button>
        </div>

        <button type="button" className="rd2-btn rd2-btn-sm" onClick={() => setDate(todayIso())}>
          Сьогодні
        </button>
        <button
          type="button"
          className="rd2-btn rd2-btn-sm"
          disabled={!hasPrevious || saving}
          title={hasPrevious ? `Скопіювати розстановку за ${previousDay}` : "За попередній день розстановки немає"}
          onClick={() => {
            if (window.confirm(`Замінити розстановку на ${date} даними за ${previousDay}?`)) void copySheet(previousDay);
          }}
        >
          Копіювати вчорашню
        </button>
        <button
          type="button"
          className="rd2-btn rd2-btn-sm"
          data-variant="danger"
          disabled={saving || (state?.assignments.length ?? 0) === 0}
          onClick={() => {
            if (window.confirm(`Очистити всю розстановку на ${date}?`)) void clearSheet();
          }}
        >
          Очистити день
        </button>
        <button type="button" className="rd2-btn rd2-btn-sm" data-variant="ghost" onClick={() => window.print()}>
          Друк
        </button>
      </header>

      <main className="rd2-content">
        {loading && <div className="rd2-skeleton" />}

        {!loading && !state && (
          <div className="rd2-note">
            <b>База даних недоступна.</b> Увімкніть D1-біндинг <code>DB</code> і перезапустіть застосунок командою
            {" "}<code>npm run dev</code>. Дані зберігаються на сервері, локальне сховище не використовується.
            <div style={{ marginTop: 10 }}>
              <button type="button" className="rd2-btn rd2-btn-sm" onClick={() => void refresh()}>
                Спробувати ще раз
              </button>
            </div>
          </div>
        )}

        {!loading && state && state.employees.length === 0 && (
          <div className="rd2-note">
            <b>База співробітників порожня.</b> Додайте людей у бічному меню — після цього їх можна перетягувати у клітинки
            графіка. Або завантажте готовий бланк РЦ-2 за 07.09.26, щоб одразу побачити застосунок у роботі.
            <div style={{ marginTop: 10 }}>
              <button type="button" className="rd2-btn rd2-btn-sm" data-variant="primary" disabled={saving} onClick={() => void seedFromSheet()}>
                Завантажити бланк 07.09.26
              </button>
            </div>
          </div>
        )}

        {!loading && state && state.employees.length > 0 && state.assignments.length === 0 && latestSheet && (
          <div className="rd2-note">
            На {formatLong(date)} розстановки ще немає. Найсвіжіший заповнений день — <b>{formatLong(latestSheet)}</b>.
            <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
              <button type="button" className="rd2-btn rd2-btn-sm" onClick={() => setDate(latestSheet)}>
                Відкрити {formatLong(latestSheet)}
              </button>
              {hasPrevious && (
                <button type="button" className="rd2-btn rd2-btn-sm" data-variant="primary" disabled={saving} onClick={() => void copySheet(previousDay)}>
                  Скопіювати вчорашню
                </button>
              )}
            </div>
          </div>
        )}

        {!loading && state && (
          <>
            <ScheduleGrid />
            <AbsenceBoard />
          </>
        )}
      </main>
    </>
  );
}
