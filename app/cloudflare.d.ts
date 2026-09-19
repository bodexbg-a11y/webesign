/// <reference types="@cloudflare/workers-types" />

/** Біндинги Cloudflare, доступні застосунку під час виконання. */
declare namespace Cloudflare {
  interface Env {
    DB: D1Database;
  }
}
