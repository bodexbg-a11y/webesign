export const jsonHeaders = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };

export function ok(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: jsonHeaders });
}

export function fail(message: string, status = 400) {
  return new Response(JSON.stringify({ error: message }), { status, headers: jsonHeaders });
}

export function handleError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("D1 binding")) {
    return fail("База даних недоступна. Увімкніть D1-біндинг `DB` і перезапустіть застосунок.", 503);
  }
  return fail(message, 500);
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function asDate(value: unknown, fallback?: string) {
  if (typeof value === "string" && DATE_RE.test(value)) return value;
  if (fallback) return fallback;
  return null;
}

export function asId(value: unknown) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function asText(value: unknown, max = 160) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function asEnum<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

/**
 * D1 приймає не більше 100 прив'язаних параметрів на один запит, тому масові
 * вставки розбиваються на пачки. Дев'ять рядків × 8 колонок — із запасом.
 */
export const INSERT_CHUNK = 9;

export function chunk<T>(rows: T[], size = INSERT_CHUNK): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < rows.length; index += size) {
    chunks.push(rows.slice(index, index + size));
  }
  return chunks;
}
