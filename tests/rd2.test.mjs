import assert from "node:assert/strict";
import test from "node:test";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

/** Оточення без біндингу D1 — саме так виглядає невдало налаштований стенд. */
function call(path, init = {}) {
  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" }, ...init }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("serves the RD-2 schedule shell", async () => {
  const response = await call("/rd2");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Графік РД-2/);
  assert.match(html, /Календар відпусток/);
  assert.match(html, /Співробітники/);
  assert.match(html, /noindex/i, "внутрішній застосунок не має індексуватись");
});

test("serves the RD-2 vacation calendar shell", async () => {
  const response = await call("/rd2/calendar");
  assert.equal(response.status, 200);
  assert.match(await response.text(), /Календар відпусток/);
});

test("keeps the marketing cookie banner off the app routes", async () => {
  const app = await call("/rd2");
  assert.doesNotMatch(await app.text(), /opsynq-consent-v1/);
});

test("reports a missing database instead of crashing", async () => {
  const response = await call("/api/rd2/state?date=2026-09-07");
  assert.equal(response.status, 503);

  const payload = await response.json();
  assert.match(payload.error, /База даних недоступна/);
});
