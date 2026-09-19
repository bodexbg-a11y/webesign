# vinext-starter

A clean full-stack starter running on
[vinext](https://github.com/cloudflare/vinext), with optional Cloudflare D1 and
Drizzle support.

## Prerequisites

- Node.js `>=22.13.0`

## Quick Start

```bash
npm install
npm run dev
npm run build
```

This starter does not use `wrangler.jsonc`.

## Included Shape

- edit site code under `app/`
- `.openai/hosting.json` declares optional Sites D1 and R2 bindings
- `vite.config.ts` simulates declared bindings for local development
- `db/schema.ts` starts intentionally empty
- `examples/d1/` contains an optional D1 example surface
- `drizzle.config.ts` supports local migration generation when needed

## Workspace Auth Headers

Signed-in visitors receive both `oai-authenticated-user-id` and `oai-authenticated-user-email`. Private Sites require every visitor to sign in; public Sites may also have anonymous visitors, for whom neither header is present.

The user ID is stable for the same user on the same Site and different across Sites. Email and name are intended for display or contact purposes.

SIWC-authenticated workspace sites may also receive
`oai-authenticated-user-full-name` when the user's SIWC profile has a non-empty
`name` claim. The full-name value is percent-encoded UTF-8 and is accompanied by
`oai-authenticated-user-full-name-encoding: percent-encoded-utf-8`.

Treat the full name as optional and fall back to email when it is absent:

```tsx
import { headers } from "next/headers";

export default async function Home() {
  const requestHeaders = await headers();
  const userId = requestHeaders.get("oai-authenticated-user-id");
  const email = requestHeaders.get("oai-authenticated-user-email");
  const encodedFullName = requestHeaders.get("oai-authenticated-user-full-name");
  const fullName =
    encodedFullName &&
    requestHeaders.get("oai-authenticated-user-full-name-encoding") ===
      "percent-encoded-utf-8"
      ? decodeURIComponent(encodedFullName)
      : null;

  const displayName = fullName ?? email;
  // ...
}
```

## Optional Dispatch-Owned ChatGPT Sign-In

Import the ready-to-use helpers from `app/chatgpt-auth.ts` when the site needs
optional or required ChatGPT sign-in:

- Use `getChatGPTUser()` for optional signed-in UI.
- Use `requireChatGPTUser(returnTo)` for server-rendered pages that should send
  anonymous visitors through Sign in with ChatGPT.
- Use `chatGPTSignInPath(returnTo)` and `chatGPTSignOutPath(returnTo)` for
  browser links or actions.
- Pass a same-origin relative `returnTo` path for the destination after sign-in
  or sign-out. The helper validates and safely encodes it.
- Mark protected pages with `export const dynamic = "force-dynamic"` because
  they depend on per-request identity headers.

Dispatch owns `/signin-with-chatgpt`, `/signout-with-chatgpt`, `/callback`, the
OAuth cookies, and identity header injection. Do not implement app routes for
those reserved paths. Routes that do not import and call the helper remain
anonymous-compatible.

SIWC establishes identity only; it does not prove workspace membership. Use the
Sites hosting platform's access policy controls for workspace-wide restrictions,
or enforce explicit server-side membership or allowlist checks.

Use SIWC for account pages, user-specific dashboards, saved records, and write
actions tied to the current ChatGPT user. Leave public content anonymous.

## Useful Commands

- `npm run dev`: start local development
- `npm run build`: verify the vinext build output
- `npm test`: build the starter and verify its rendered loading skeleton
- `npm run db:generate`: generate Drizzle migrations after schema changes

## Learn More

- [vinext Documentation](https://github.com/cloudflare/vinext)
- [Drizzle D1 Guide](https://orm.drizzle.team/docs/get-started/d1-new)

## Графік РД-2 (внутрішній застосунок)

Веб-застосунок для розстановки оперативного персоналу РЦ-2 та обліку відпусток.
Живе поряд із маркетинговим сайтом, але має власний каркас, стилі та API.

### Запуск

```bash
npm install
npm run dev        # http://localhost:3000/rd2
```

Дані зберігаються в Cloudflare D1 (локально — Miniflare). Біндинг `DB`
оголошено в `.openai/hosting.json`; таблиці створюються автоматично при
першому запиті, окремий крок міграції не потрібен. Якщо база порожня, на
сторінці «Графік» з'явиться кнопка, що завантажує бланк за 07.09.26.

### Екрани

| Маршрут         | Призначення                                                        |
| --------------- | ------------------------------------------------------------------ |
| `/rd2`          | Розстановка на дату + таблиці відпусток, лікарняних і відряджень    |
| `/rd2/calendar` | Календар відпусток: стрічка (Ґант) по місяцях і класична місячна сітка |

Обидві сторінки закриті від індексації (`robots: noindex`), але **не мають
автентифікації** — у публічному розгортанні їх бачитиме кожен, хто знає адресу.

### Структура

```
app/rd2/              інтерфейс (клієнтські компоненти, власний rd2.css)
app/rd2/lib/          модель даних, клієнтське сховище, drag-and-drop
app/api/rd2/          REST-ендпойнти
db/schema.ts          таблиці Drizzle (rd2_*)
db/rd2.ts             автоматичне створення таблиць і довідник посад
db/rd2-seed.ts        стартовий бланк 07.09.26
```

### API

| Метод                 | Маршрут                    | Дія                                        |
| --------------------- | -------------------------- | ------------------------------------------ |
| `GET`                 | `/api/rd2/state?date=`     | повний зріз даних на дату                  |
| `POST`                | `/api/rd2/assignments`     | запис комірок, `op: copy`, `op: clear`     |
| `GET/POST/DELETE`     | `/api/rd2/employees`       | єдина база співробітників                  |
| `PATCH/DELETE`        | `/api/rd2/employees/:id`   | картка співробітника                       |
| `PATCH`               | `/api/rd2/positions/:id`   | назва та норматив посади                   |
| `GET/POST`            | `/api/rd2/absences`        | відпустки, лікарняні, відрядження          |
| `PATCH/DELETE`        | `/api/rd2/absences/:id`    | редагування запису                         |
| `POST`                | `/api/rd2/seed`            | стартовий бланк (лише для порожньої бази)  |

D1 приймає щонайбільше 100 прив'язаних параметрів на запит, тому масові
вставки розбиваються на пачки (`chunk()` в `app/api/rd2/_util.ts`).
