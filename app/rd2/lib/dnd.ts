import type { ColumnCode, RowKind } from "./model";

export const DND_MIME = "application/x-rd2-employee";

export type DragSource = { positionId: number; columnCode: ColumnCode; rowKind: RowKind } | null;

export type DragPayload = { employeeId: number; from: DragSource };

/**
 * Браузери не дають читати dataTransfer під час dragover, тому активне
 * перетягування дублюється в модулі — це єдине джерело правди для підсвітки.
 */
let active: DragPayload | null = null;

export function beginDrag(event: React.DragEvent, payload: DragPayload) {
  active = payload;
  event.dataTransfer.effectAllowed = "move";
  try {
    event.dataTransfer.setData(DND_MIME, JSON.stringify(payload));
    event.dataTransfer.setData("text/plain", String(payload.employeeId));
  } catch {
    /* Safari може блокувати кастомні типи — лишається модульний стан. */
  }
}

export function endDrag() {
  active = null;
}

export function currentDrag() {
  return active;
}

export function readDrag(event: React.DragEvent): DragPayload | null {
  try {
    const raw = event.dataTransfer.getData(DND_MIME);
    if (raw) return JSON.parse(raw) as DragPayload;
  } catch {
    /* ігноруємо — нижче фолбек */
  }
  return active;
}
