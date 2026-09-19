import { eq } from "drizzle-orm";
import { rd2Db } from "@/db/rd2";
import { absences } from "@/db/schema";
import { asDate, asEnum, asId, asText, fail, handleError, ok } from "../../_util";
import { ABSENCE_KINDS } from "../route";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  try {
    const id = asId((await ctx.params).id);
    if (!id) return fail("Невірний ідентифікатор.");
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

    const patch: Record<string, unknown> = {};
    if (body.kind !== undefined) patch.kind = asEnum(body.kind, ABSENCE_KINDS, "vacation");
    if (body.note !== undefined) patch.note = asText(body.note, 240);
    if (body.startDate !== undefined) {
      const startDate = asDate(body.startDate);
      if (!startDate) return fail("Невірна дата «з».");
      patch.startDate = startDate;
    }
    if (body.endDate !== undefined) {
      const endDate = asDate(body.endDate);
      if (!endDate) return fail("Невірна дата «по».");
      patch.endDate = endDate;
    }
    if (Object.keys(patch).length === 0) return fail("Немає змін.");

    const db = await rd2Db();
    const [current] = await db.select().from(absences).where(eq(absences.id, id)).limit(1);
    if (!current) return fail("Запис не знайдено.", 404);

    // Перевіряємо підсумковий період: одна змінена межа теж може його зламати.
    const nextStart = typeof patch.startDate === "string" ? patch.startDate : current.startDate;
    const nextEnd = typeof patch.endDate === "string" ? patch.endDate : current.endDate;
    if (nextEnd < nextStart) return fail("Дата «по» не може бути раніше за дату «з».");

    const [updated] = await db.update(absences).set(patch).where(eq(absences.id, id)).returning();
    if (!updated) return fail("Запис не знайдено.", 404);
    return ok(updated);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  try {
    const id = asId((await ctx.params).id);
    if (!id) return fail("Невірний ідентифікатор.");
    const db = await rd2Db();
    await db.delete(absences).where(eq(absences.id, id));
    return ok({ deleted: id });
  } catch (error) {
    return handleError(error);
  }
}
