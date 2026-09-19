import { asc } from "drizzle-orm";
import { rd2Db } from "@/db/rd2";
import { absences } from "@/db/schema";
import { asDate, asEnum, asId, asText, fail, handleError, ok } from "../_util";

export const dynamic = "force-dynamic";

export const ABSENCE_KINDS = ["vacation", "planned", "sick", "trip"] as const;

export async function GET() {
  try {
    const db = await rd2Db();
    return ok(await db.select().from(absences).orderBy(asc(absences.startDate)));
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const employeeId = asId(body.employeeId);
    const startDate = asDate(body.startDate);
    const endDate = asDate(body.endDate);
    if (!employeeId) return fail("Оберіть співробітника.");
    if (!startDate || !endDate) return fail("Вкажіть період у форматі РРРР-ММ-ДД.");
    if (endDate < startDate) return fail("Дата «по» не може бути раніше за дату «з».");

    const db = await rd2Db();
    const [created] = await db
      .insert(absences)
      .values({
        employeeId,
        kind: asEnum(body.kind, ABSENCE_KINDS, "vacation"),
        startDate,
        endDate,
        note: asText(body.note, 240),
      })
      .returning();
    return ok(created, 201);
  } catch (error) {
    return handleError(error);
  }
}
