import { asc } from "drizzle-orm";
import { rd2Db } from "@/db/rd2";
import { absences, assignments, employees, positions } from "@/db/schema";
import { asDate, handleError, ok } from "../_util";

export const dynamic = "force-dynamic";

/** Повний зріз даних для сторінок «Графік» і «Календар». */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const date = asDate(url.searchParams.get("date"), new Date().toISOString().slice(0, 10))!;
    const db = await rd2Db();

    const [positionRows, employeeRows, assignmentRows, absenceRows] = await Promise.all([
      db.select().from(positions).orderBy(asc(positions.sortOrder), asc(positions.id)),
      db.select().from(employees).orderBy(asc(employees.fullName)),
      db.select().from(assignments).orderBy(asc(assignments.slotIndex)),
      db.select().from(absences).orderBy(asc(absences.startDate)),
    ]);

    return ok({
      date,
      positions: positionRows,
      employees: employeeRows,
      assignments: assignmentRows.filter((row) => row.sheetDate === date),
      sheetDates: [...new Set(assignmentRows.map((row) => row.sheetDate))].sort(),
      absences: absenceRows,
    });
  } catch (error) {
    return handleError(error);
  }
}
