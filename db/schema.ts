import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

/** Посади оперативного персоналу (НЗРЦ, ШУР, ІЕУ, СОРВ, ОРВ, МОТУ). */
export const positions = sqliteTable("rd2_positions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  code: text("code").notNull(),
  label: text("label").notNull(),
  quota: text("quota").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
}, (t) => [uniqueIndex("rd2_positions_code_idx").on(t.code)]);

/** Єдина база співробітників. */
export const employees = sqliteTable("rd2_employees", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fullName: text("full_name").notNull(),
  positionId: integer("position_id").notNull(),
  staffGroup: text("staff_group").notNull().default("shift"), // shift | day
  rank: text("rank").notNull().default("main"), // main | trainee
  tag: text("tag").notNull().default(""),
  phone: text("phone").notNull().default(""),
  note: text("note").notNull().default(""),
  active: integer("active").notNull().default(1),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (t) => [index("rd2_employees_position_idx").on(t.positionId)]);

/** Розстановка персоналу на конкретну дату. */
export const assignments = sqliteTable("rd2_assignments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sheetDate: text("sheet_date").notNull(),
  positionId: integer("position_id").notNull(),
  columnCode: text("column_code").notNull(), // A|B|V|G|D|DAY|NTC|SICK
  rowKind: text("row_kind").notNull().default("main"), // main | trainee
  slotIndex: integer("slot_index").notNull().default(0),
  employeeId: integer("employee_id").notNull(),
  note: text("note").notNull().default(""),
}, (t) => [
  index("rd2_assignments_sheet_idx").on(t.sheetDate),
  uniqueIndex("rd2_assignments_slot_idx").on(t.sheetDate, t.positionId, t.columnCode, t.rowKind, t.slotIndex),
]);

/** Відпустки, лікарняні, відрядження. */
export const absences = sqliteTable("rd2_absences", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  employeeId: integer("employee_id").notNull(),
  kind: text("kind").notNull().default("vacation"), // vacation | planned | sick | trip
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  note: text("note").notNull().default(""),
}, (t) => [index("rd2_absences_employee_idx").on(t.employeeId)]);
