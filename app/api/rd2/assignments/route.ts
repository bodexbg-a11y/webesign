import { and, eq } from "drizzle-orm";
import { rd2Db } from "@/db/rd2";
import { assignments } from "@/db/schema";
import { asDate, asEnum, asId, asText, chunk, fail, handleError, ok } from "../_util";

export const dynamic = "force-dynamic";

const ROW_KINDS = ["main", "trainee"] as const;
const COLUMNS = ["A", "B", "V", "G", "D", "DAY", "NTC", "SICK"] as const;

type CellPayload = {
  positionId: number;
  columnCode: (typeof COLUMNS)[number];
  rowKind: (typeof ROW_KINDS)[number];
  items: { employeeId: number; note: string }[];
};

function parseCell(raw: unknown): CellPayload | null {
  if (!raw || typeof raw !== "object") return null;
  const cell = raw as Record<string, unknown>;
  const positionId = asId(cell.positionId);
  if (!positionId) return null;
  if (!COLUMNS.includes(cell.columnCode as (typeof COLUMNS)[number])) return null;

  const items = Array.isArray(cell.items) ? cell.items : [];
  const parsed: CellPayload["items"] = [];
  for (const item of items.slice(0, 20)) {
    const employeeId = asId((item as Record<string, unknown>)?.employeeId);
    if (!employeeId) continue;
    if (parsed.some((existing) => existing.employeeId === employeeId)) continue;
    parsed.push({ employeeId, note: asText((item as Record<string, unknown>)?.note, 40) });
  }

  return {
    positionId,
    columnCode: cell.columnCode as (typeof COLUMNS)[number],
    rowKind: asEnum(cell.rowKind, ROW_KINDS, "main"),
    items: parsed,
  };
}

/**
 * Записує вміст комірок розстановки. Клієнт надсилає повний склад кожної
 * зміненої комірки, тому переміщення, сортування й видалення — одна операція.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const db = await rd2Db();

    if (body.op === "copy") {
      const fromDate = asDate(body.fromDate);
      const toDate = asDate(body.toDate);
      if (!fromDate || !toDate) return fail("Вкажіть коректні дати.");
      if (fromDate === toDate) return fail("Дати збігаються.");
      const source = await db.select().from(assignments).where(eq(assignments.sheetDate, fromDate));
      if (source.length === 0) return fail("На обрану дату немає розстановки для копіювання.", 404);
      await db.delete(assignments).where(eq(assignments.sheetDate, toDate));
      const copies = source.map((row) => ({
        sheetDate: toDate,
        positionId: row.positionId,
        columnCode: row.columnCode,
        rowKind: row.rowKind,
        slotIndex: row.slotIndex,
        employeeId: row.employeeId,
        note: row.note,
      }));
      for (const batch of chunk(copies)) {
        await db.insert(assignments).values(batch);
      }
      return ok({ copied: source.length, date: toDate });
    }

    const date = asDate(body.date);
    if (!date) return fail("Вкажіть дату розстановки.");

    if (body.op === "clear") {
      await db.delete(assignments).where(eq(assignments.sheetDate, date));
      return ok({ cleared: date });
    }

    const rawCells = Array.isArray(body.cells) ? body.cells : [];
    if (rawCells.length === 0) return fail("Немає комірок для запису.");

    for (const raw of rawCells.slice(0, 40)) {
      const cell = parseCell(raw);
      if (!cell) continue;
      await db.delete(assignments).where(
        and(
          eq(assignments.sheetDate, date),
          eq(assignments.positionId, cell.positionId),
          eq(assignments.columnCode, cell.columnCode),
          eq(assignments.rowKind, cell.rowKind),
        ),
      );
      const rows = cell.items.map((item, index) => ({
        sheetDate: date,
        positionId: cell.positionId,
        columnCode: cell.columnCode,
        rowKind: cell.rowKind,
        slotIndex: index,
        employeeId: item.employeeId,
        note: item.note,
      }));
      for (const batch of chunk(rows)) {
        await db.insert(assignments).values(batch);
      }
    }

    const saved = await db.select().from(assignments).where(eq(assignments.sheetDate, date));
    return ok({ date, assignments: saved });
  } catch (error) {
    return handleError(error);
  }
}
