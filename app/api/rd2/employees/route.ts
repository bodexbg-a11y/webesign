import { asc, eq } from "drizzle-orm";
import { rd2Db } from "@/db/rd2";
import { employees } from "@/db/schema";
import { asEnum, asId, asText, fail, handleError, ok } from "../_util";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await rd2Db();
    return ok(await db.select().from(employees).orderBy(asc(employees.fullName)));
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const fullName = asText((body as Record<string, unknown>).fullName);
    const positionId = asId((body as Record<string, unknown>).positionId);
    if (!fullName) return fail("Вкажіть П.І.Б. співробітника.");
    if (!positionId) return fail("Оберіть посаду.");

    const db = await rd2Db();
    const [created] = await db
      .insert(employees)
      .values({
        fullName,
        positionId,
        staffGroup: asEnum((body as Record<string, unknown>).staffGroup, ["shift", "day"] as const, "shift"),
        rank: asEnum((body as Record<string, unknown>).rank, ["main", "trainee"] as const, "main"),
        tag: asText((body as Record<string, unknown>).tag, 24),
        phone: asText((body as Record<string, unknown>).phone, 40),
        note: asText((body as Record<string, unknown>).note, 240),
      })
      .returning();

    return ok(created, 201);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = asId(url.searchParams.get("id"));
    if (!id) return fail("Невірний ідентифікатор.");
    const db = await rd2Db();
    await db.delete(employees).where(eq(employees.id, id));
    return ok({ deleted: id });
  } catch (error) {
    return handleError(error);
  }
}
