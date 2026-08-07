import assert from "node:assert/strict";
import test from "node:test";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

async function render(path = "/") {
  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the finished NORTH/OS homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Business Operating System/i);
  assert.match(html, /Custom Business/);
  assert.match(html, /Operating Systems/);
  assert.match(html, /application\/ld\+json/i);
  assert.match(html, /Book free strategy call/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|Building your site/i);
});

test("renders priority market, service and industry landing pages", async () => {
  const pages = [
    ["/nl", /Business automation software for Dutch companies/i],
    ["/no", /Business automation software for Norwegian companies/i],
    ["/sv", /Business automation software for Swedish companies/i],
    ["/da", /Business automation software for Danish companies/i],
    ["/services/custom-crm-development", /custom CRM development/i],
    ["/services/workflow-automation", /workflow automation/i],
    ["/solutions/construction-os", /construction management software/i],
  ];

  for (const [path, expected] of pages) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    assert.match(await response.text(), expected, path);
  }
});
