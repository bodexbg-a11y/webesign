import { eq } from "drizzle-orm";
import { rd2Db } from "@/db/rd2";
import { positions } from "@/db/schema";
import { asId, asText, fail, handleError, ok } from "../../_util";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  try {
    const id = asId((await ctx.params).id);
    if (!id) return fail("Невірний ідентифікатор.");
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

    const patch: Record<string, unknown> = {};
    if (typeof body.label === "string") {
      const label = asText(body.label, 32);
      if (!label) return fail("Назва посади не може бути порожньою.");
      patch.label = label;
    }
    if (body.quota !== undefined) patch.quota = asText(body.quota, 24);
    if (body.sortOrder !== undefined && Number.isInteger(Number(body.sortOrder))) {
      patch.sortOrder = Number(body.sortOrder);
    }
    if (Object.keys(patch).length === 0) return fail("Немає змін.");

    const db = await rd2Db();
    const [updated] = await db.update(positions).set(patch).where(eq(positions.id, id)).returning();
    if (!updated) return fail("Посаду не знайдено.", 404);
    return ok(updated);
  } catch (error) {
    return handleError(error);
  }
}
