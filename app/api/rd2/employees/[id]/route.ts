import { and, eq } from "drizzle-orm";
import { rd2Db } from "@/db/rd2";
import { absences, assignments, employees } from "@/db/schema";
import { asEnum, asId, asText, fail, handleError, ok } from "../../_util";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  try {
    const id = asId((await ctx.params).id);
    if (!id) return fail("Невірний ідентифікатор.");
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

    const patch: Record<string, unknown> = {};
    if (typeof body.fullName === "string") {
      const fullName = asText(body.fullName);
      if (!fullName) return fail("П.І.Б. не може бути порожнім.");
      patch.fullName = fullName;
    }
    if (body.positionId !== undefined) {
      const positionId = asId(body.positionId);
      if (!positionId) return fail("Невірна посада.");
      patch.positionId = positionId;
    }
    if (body.staffGroup !== undefined) patch.staffGroup = asEnum(body.staffGroup, ["shift", "day"] as const, "shift");
    if (body.rank !== undefined) patch.rank = asEnum(body.rank, ["main", "trainee"] as const, "main");
    if (body.tag !== undefined) patch.tag = asText(body.tag, 24);
    if (body.phone !== undefined) patch.phone = asText(body.phone, 40);
    if (body.note !== undefined) patch.note = asText(body.note, 240);
    if (body.active !== undefined) patch.active = body.active ? 1 : 0;

    if (Object.keys(patch).length === 0) return fail("Немає змін.");

    const db = await rd2Db();
    const [updated] = await db.update(employees).set(patch).where(eq(employees.id, id)).returning();
    if (!updated) return fail("Співробітника не знайдено.", 404);
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
    await db.delete(assignments).where(eq(assignments.employeeId, id));
    await db.delete(absences).where(eq(absences.employeeId, id));
    await db.delete(employees).where(and(eq(employees.id, id)));
    return ok({ deleted: id });
  } catch (error) {
    return handleError(error);
  }
}
