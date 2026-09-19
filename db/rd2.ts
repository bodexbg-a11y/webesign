import { sql } from "drizzle-orm";
import { positions } from "./schema";

const DDL = [
  `CREATE TABLE IF NOT EXISTS rd2_positions (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     code TEXT NOT NULL,
     label TEXT NOT NULL,
     quota TEXT NOT NULL DEFAULT '',
     sort_order INTEGER NOT NULL DEFAULT 0
   )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS rd2_positions_code_idx ON rd2_positions (code)`,
  `CREATE TABLE IF NOT EXISTS rd2_employees (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     full_name TEXT NOT NULL,
     position_id INTEGER NOT NULL,
     staff_group TEXT NOT NULL DEFAULT 'shift',
     rank TEXT NOT NULL DEFAULT 'main',
     tag TEXT NOT NULL DEFAULT '',
     phone TEXT NOT NULL DEFAULT '',
     note TEXT NOT NULL DEFAULT '',
     active INTEGER NOT NULL DEFAULT 1,
     created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
   )`,
  `CREATE INDEX IF NOT EXISTS rd2_employees_position_idx ON rd2_employees (position_id)`,
  `CREATE TABLE IF NOT EXISTS rd2_assignments (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     sheet_date TEXT NOT NULL,
     position_id INTEGER NOT NULL,
     column_code TEXT NOT NULL,
     row_kind TEXT NOT NULL DEFAULT 'main',
     slot_index INTEGER NOT NULL DEFAULT 0,
     employee_id INTEGER NOT NULL,
     note TEXT NOT NULL DEFAULT ''
   )`,
  `CREATE INDEX IF NOT EXISTS rd2_assignments_sheet_idx ON rd2_assignments (sheet_date)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS rd2_assignments_slot_idx
     ON rd2_assignments (sheet_date, position_id, column_code, row_kind, slot_index)`,
  `CREATE TABLE IF NOT EXISTS rd2_absences (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     employee_id INTEGER NOT NULL,
     kind TEXT NOT NULL DEFAULT 'vacation',
     start_date TEXT NOT NULL,
     end_date TEXT NOT NULL,
     note TEXT NOT NULL DEFAULT ''
   )`,
  `CREATE INDEX IF NOT EXISTS rd2_absences_employee_idx ON rd2_absences (employee_id)`,
];

export const DEFAULT_POSITIONS = [
  { code: "NZRC", label: "НЗРЦ", quota: "11/11", sortOrder: 1 },
  { code: "SHUR", label: "ШУР", quota: "9/8+5", sortOrder: 2 },
  { code: "IEU", label: "ІЕУ", quota: "8/8", sortOrder: 3 },
  { code: "SORV", label: "СОРВ", quota: "8/8", sortOrder: 4 },
  { code: "ORV", label: "ОРВ", quota: "7/6+1", sortOrder: 5 },
  { code: "MOTU", label: "МОТУ", quota: "7/7+1+1", sortOrder: 6 },
];

let ready: Promise<void> | null = null;

/**
 * `cloudflare:workers` існує лише всередині Workers-рантайму. Динамічний імпорт
 * дозволяє перехопити його відсутність (наприклад, у node-тестах) і відповісти
 * зрозумілою помилкою замість падіння модуля.
 */
async function connect() {
  try {
    const { getDb } = await import("./index");
    return getDb();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("D1 binding")) throw error;
    throw new Error("Cloudflare D1 binding `DB` is unavailable outside the Workers runtime.");
  }
}

async function migrate() {
  const db = await connect();
  for (const statement of DDL) {
    await db.run(sql.raw(statement));
  }
  const existing = await db.select({ id: positions.id }).from(positions).limit(1);
  if (existing.length === 0) {
    await db.insert(positions).values(DEFAULT_POSITIONS);
  }
}

/** Створює таблиці при першому зверненні — окремий крок міграції не потрібен. */
export async function rd2Db() {
  if (!ready) {
    ready = migrate().catch((error) => {
      ready = null;
      throw error;
    });
  }
  await ready;
  return connect();
}
