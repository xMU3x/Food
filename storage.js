/**
 * Storage abstraction layer
 * Uses Vercel KV (Redis) when KV_REST_API_URL env var is present,
 * otherwise falls back to /tmp JSON files (suitable for local dev).
 *
 * Vercel KV is the recommended production solution:
 *   https://vercel.com/docs/storage/vercel-kv
 *
 * NOTE: /tmp on Vercel is ephemeral per-function invocation and NOT shared
 * across deployments or concurrent instances. For persistent production data,
 * KV_REST_API_URL + KV_REST_API_TOKEN env vars MUST be set in the Vercel dashboard.
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

// ── Vercel KV (Redis) backend ────────────────────────────────────────────────
async function kvGet(key) {
  const { KV_REST_API_URL, KV_REST_API_TOKEN } = process.env;
  const res = await fetch(`${KV_REST_API_URL}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}` },
  });
  if (!res.ok) return null;
  const { result } = await res.json();
  if (result === null || result === undefined) return null;
  try {
    return JSON.parse(result);
  } catch {
    return result;
  }
}

async function kvSet(key, value) {
  const { KV_REST_API_URL, KV_REST_API_TOKEN } = process.env;
  const res = await fetch(`${KV_REST_API_URL}/set/${encodeURIComponent(key)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KV_REST_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ value: JSON.stringify(value) }),
  });
  if (!res.ok) throw new Error(`KV set failed: ${res.status}`);
}

// ── /tmp JSON file backend (local dev / fallback) ────────────────────────────
const TMP_DIR = "/tmp";

function tmpPath(key) {
  // Sanitize key to a safe filename
  return join(TMP_DIR, `food_order_${key.replace(/[^a-z0-9_-]/gi, "_")}.json`);
}

function tmpGet(key) {
  const p = tmpPath(key);
  if (!existsSync(p)) return null;
  try {
    return JSON.parse(readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

function tmpSet(key, value) {
  writeFileSync(tmpPath(key), JSON.stringify(value), "utf8");
}

// ── Public API ───────────────────────────────────────────────────────────────
const useKV = () =>
  Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

export async function storageGet(key) {
  if (useKV()) return kvGet(key);
  return tmpGet(key);
}

export async function storageSet(key, value) {
  if (useKV()) return kvSet(key, value);
  tmpSet(key, value);
}
