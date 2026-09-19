import { rd2Db } from "@/db/rd2";
import { SEED_ABSENCES, SEED_DATE, SEED_ROSTER } from "@/db/rd2-seed";
import { absences, assignments, employees, positions } from "@/db/schema";
import { chunk, fail, handleError, ok } from "../_util";

export const dynamic = "force-dynamic";

/** Одноразове наповнення порожньої бази даними з бланка 07.09.26. */
export async function POST() {
  try {
    const db = await rd2Db();
    const existing = await db.select({ id: employees.id }).from(employees).limit(1);
    if (existing.length > 0) return fail("База вже містить співробітників — завантаження бланка скасовано.", 409);

    const positionRows = await db.select().from(positions);
    const positionByCode = new Map(positionRows.map((row) => [row.code, row.id]));
    const idByName = new Map<string, number>();

    for (const [code, people] of Object.entries(SEED_ROSTER)) {
      const positionId = positionByCode.get(code);
      if (!positionId) continue;
      for (const person of people) {
        const [created] = await db
          .insert(employees)
          .values({
            fullName: person.name,
            positionId,
            staffGroup: person.group ?? "shift",
            rank: person.row === "trainee" ? "trainee" : "main",
            tag: person.tag ?? "",
          })
          .returning({ id: employees.id });
        idByName.set(person.name, created.id);
      }
    }

    const slots = new Map<string, number>();
    for (const [code, people] of Object.entries(SEED_ROSTER)) {
      const positionId = positionByCode.get(code);
      if (!positionId) continue;
      for (const person of people) {
        const employeeId = idByName.get(person.name);
        if (!employeeId || !person.column) continue;
        const rowKind = person.row === "trainee" ? "trainee" : "main";
        const key = `${positionId}:${person.column}:${rowKind}`;
        const slotIndex = slots.get(key) ?? 0;
        slots.set(key, slotIndex + 1);
        await db.insert(assignments).values({
          sheetDate: SEED_DATE,
          positionId,
          columnCode: person.column,
          rowKind,
          slotIndex,
          employeeId,
        });
      }
    }

    const absenceRows = SEED_ABSENCES.flatMap((item) => {
      const employeeId = idByName.get(item.name);
      return employeeId ? [{ employeeId, kind: item.kind, startDate: item.start, endDate: item.end, note: "" }] : [];
    });
    for (const batch of chunk(absenceRows)) {
      await db.insert(absences).values(batch);
    }

    return ok({ employees: idByName.size, absences: absenceRows.length, date: SEED_DATE });
  } catch (error) {
    return handleError(error);
  }
}
