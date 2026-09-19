export type Position = { id: number; code: string; label: string; quota: string; sortOrder: number };

export type Employee = {
  id: number;
  fullName: string;
  positionId: number;
  staffGroup: "shift" | "day";
  rank: "main" | "trainee";
  tag: string;
  phone: string;
  note: string;
  active: number;
  createdAt: string;
};

export type Assignment = {
  id: number;
  sheetDate: string;
  positionId: number;
  columnCode: ColumnCode;
  rowKind: RowKind;
  slotIndex: number;
  employeeId: number;
  note: string;
};

export type AbsenceKind = "vacation" | "planned" | "sick" | "trip";

export type Absence = {
  id: number;
  employeeId: number;
  kind: AbsenceKind;
  startDate: string;
  endDate: string;
  note: string;
};

export type Rd2State = {
  date: string;
  positions: Position[];
  employees: Employee[];
  assignments: Assignment[];
  sheetDates: string[];
  absences: Absence[];
};

export type ColumnCode = "A" | "B" | "V" | "G" | "D" | "DAY" | "NTC" | "SICK";
export type RowKind = "main" | "trainee";

export const SHIFT_COLUMNS: { code: ColumnCode; label: string }[] = [
  { code: "A", label: "А" },
  { code: "B", label: "Б" },
  { code: "V", label: "В" },
  { code: "G", label: "Г" },
  { code: "D", label: "Д" },
];

export const EXTRA_COLUMNS: { code: ColumnCode; label: string }[] = [
  { code: "DAY", label: "Денний" },
  { code: "NTC", label: "НТЦ" },
  { code: "SICK", label: "Лікарняний" },
];

export const ALL_COLUMNS = [...SHIFT_COLUMNS, ...EXTRA_COLUMNS];

export const ABSENCE_META: Record<AbsenceKind, { label: string; short: string; color: string }> = {
  vacation: { label: "У відпустці", short: "Відп.", color: "#2f7d55" },
  planned: { label: "Оформлена відпустка", short: "Оформл.", color: "#2563a8" },
  sick: { label: "Лікарняний", short: "Лікарн.", color: "#a8442a" },
  trip: { label: "Відрядження", short: "Відряд.", color: "#6b4ba8" },
};

export const ABSENCE_ORDER: AbsenceKind[] = ["vacation", "planned", "sick", "trip"];

export const MONTHS = [
  "Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень",
  "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень",
];

export const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

export function todayIso() {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function isoOf(year: number, month: number, day: number) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

export function shiftIsoDay(iso: string, delta: number) {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + delta));
  return date.toISOString().slice(0, 10);
}

export function formatShort(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${day}.${month}.${year.slice(2)}`;
}

export function formatLong(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return `${pad(day)} ${MONTHS[month - 1].toLowerCase()} ${year}`;
}

export function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

/** Понеділок = 0, неділя = 6. */
export function weekdayIndex(year: number, month: number, day: number) {
  return (new Date(year, month, day).getDay() + 6) % 7;
}

export function coversDate(absence: Absence, iso: string) {
  return absence.startDate <= iso && absence.endDate >= iso;
}

export function surname(fullName: string) {
  return fullName.split(/\s+/)[0] ?? fullName;
}

export function initials(fullName: string) {
  const parts = fullName.replace(/\s+/g, " ").trim().split(" ");
  const first = parts[0]?.[0] ?? "?";
  const second = parts[1]?.[0] ?? "";
  return (first + second).toUpperCase();
}

export function cellKey(positionId: number, columnCode: ColumnCode, rowKind: RowKind) {
  return `${positionId}:${columnCode}:${rowKind}`;
}
