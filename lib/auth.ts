import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getDb } from "@/lib/db";

const COOKIE = "ha_geez_admin";
const FLASH = "ha_geez_recovery_once";
const WEEK = 60 * 60 * 24 * 7;
const LOCK_MS = 15 * 60 * 1000;
const MAX_FAILS = 5;
const RECOVERY_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

type AuthRow = {
  password_hash: string;
  recovery_hash: string;
  session_key: string;
  failed_attempts: number;
  locked_until: string | null;
};

export type PasswordResult = "ok" | "bad" | "locked" | "unset";

function hashSecret(secret: string): string {
  const salt = randomBytes(16);
  const N = 16384;
  const r = 8;
  const p = 1;
  const hash = scryptSync(secret, salt, 32, { N, r, p, maxmem: 64 * 1024 * 1024 });
  return `scrypt$${N}$${r}$${p}$${salt.toString("base64url")}$${hash.toString("base64url")}`;
}

function verifySecret(secret: string, stored: string): boolean {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const N = Number(parts[1]);
  const r = Number(parts[2]);
  const p = Number(parts[3]);
  if (!Number.isInteger(N) || N < 2 || N > 2 ** 20) return false;
  if (!Number.isInteger(r) || r < 1 || r > 32) return false;
  if (!Number.isInteger(p) || p < 1 || p > 8) return false;
  const salt = Buffer.from(parts[4], "base64url");
  const expected = Buffer.from(parts[5], "base64url");
  if (salt.length < 8 || expected.length < 16) return false;
  const actual = scryptSync(secret, salt, expected.length, { N, r, p, maxmem: 64 * 1024 * 1024 });
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

function safeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function canonicalRecovery(input: string): string | null {
  const compact = input.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!/^[A-Z0-9]{16}$/.test(compact)) return null;
  return compact;
}

function formatRecovery(compact: string): string {
  return `${compact.slice(0, 4)}-${compact.slice(4, 8)}-${compact.slice(8, 12)}-${compact.slice(12, 16)}`;
}

function newRecoveryCode(): string {
  const bytes = randomBytes(16);
  const compact = [...bytes].map((byte) => RECOVERY_ALPHABET[byte % RECOVERY_ALPHABET.length]).join("");
  return formatRecovery(compact);
}

function newSessionKey(): string {
  return randomBytes(32).toString("base64url");
}

async function readAuth(): Promise<AuthRow | null> {
  const db = await getDb();
  const result = await db.execute(
    "SELECT password_hash, recovery_hash, session_key, failed_attempts, locked_until FROM admin_auth WHERE id = 1",
  );
  const row = result.rows[0];
  if (!row) return null;
  return {
    password_hash: String(row.password_hash),
    recovery_hash: String(row.recovery_hash),
    session_key: String(row.session_key),
    failed_attempts: Number(row.failed_attempts ?? 0),
    locked_until: row.locked_until == null || row.locked_until === "" ? null : String(row.locked_until),
  };
}

function lockActive(row: AuthRow): boolean {
  if (!row.locked_until) return false;
  const until = Date.parse(row.locked_until);
  return Number.isFinite(until) && until > Date.now();
}

async function registerFailure(row: AuthRow) {
  const expired = Boolean(row.locked_until && Date.parse(row.locked_until) <= Date.now());
  const base = expired ? 0 : row.failed_attempts;
  const fails = base + 1;
  const lockedUntil = fails >= MAX_FAILS ? new Date(Date.now() + LOCK_MS).toISOString() : null;
  const db = await getDb();
  await db.execute({
    sql: "UPDATE admin_auth SET failed_attempts = ?, locked_until = ? WHERE id = 1",
    args: [fails, lockedUntil],
  });
}

async function clearFailures() {
  const db = await getDb();
  await db.execute("UPDATE admin_auth SET failed_attempts = 0, locked_until = NULL WHERE id = 1");
}

export async function hasAdminPassword(): Promise<boolean> {
  const row = await readAuth();
  return row !== null;
}

export async function createAdminPassword(password: string): Promise<{ recoveryCode: string }> {
  const db = await getDb();
  const existing = await db.execute("SELECT id FROM admin_auth WHERE id = 1");
  if (existing.rows[0]) {
    throw new Error("password-exists");
  }
  const recoveryCode = newRecoveryCode();
  const compact = canonicalRecovery(recoveryCode);
  if (!compact) throw new Error("recovery-code");
  await db.execute({
    sql: `INSERT INTO admin_auth (
      id, password_hash, recovery_hash, session_key, failed_attempts, locked_until
    ) VALUES (1, ?, ?, ?, 0, NULL)`,
    args: [hashSecret(password), hashSecret(compact), newSessionKey()],
  });
  return { recoveryCode };
}

export async function loginWithPassword(password: string): Promise<PasswordResult> {
  const row = await readAuth();
  if (!row) return "unset";
  if (lockActive(row)) return "locked";
  if (!verifySecret(password, row.password_hash)) {
    await registerFailure(row);
    return "bad";
  }
  await clearFailures();
  return "ok";
}

export async function resetWithRecovery(
  code: string,
  password: string,
): Promise<{ ok: true; recoveryCode: string } | { ok: false; reason: "unset" | "locked" | "bad" }> {
  const row = await readAuth();
  if (!row) return { ok: false, reason: "unset" };
  if (lockActive(row)) return { ok: false, reason: "locked" };
  const compact = canonicalRecovery(code);
  if (!compact || !verifySecret(compact, row.recovery_hash)) {
    await registerFailure(row);
    return { ok: false, reason: "bad" };
  }
  const recoveryCode = newRecoveryCode();
  const next = canonicalRecovery(recoveryCode);
  if (!next) return { ok: false, reason: "bad" };
  const db = await getDb();
  await db.execute({
    sql: `UPDATE admin_auth
      SET password_hash = ?, recovery_hash = ?, session_key = ?, failed_attempts = 0, locked_until = NULL
      WHERE id = 1`,
    args: [hashSecret(password), hashSecret(next), newSessionKey()],
  });
  return { ok: true, recoveryCode };
}

export async function createSession() {
  const row = await readAuth();
  if (!row) return;
  const payload = `v2.${Date.now() + WEEK * 1000}.${randomBytes(9).toString("base64url")}`;
  const token = `${payload}.${sign(payload, row.session_key)}`;
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: WEEK,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  const row = await readAuth();
  if (!row) return false;
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 4 || parts[0] !== "v2") return false;
  const payload = `${parts[0]}.${parts[1]}.${parts[2]}`;
  if (!safeEqual(parts[3], sign(payload, row.session_key))) return false;
  const expires = Number(parts[1]);
  return Number.isFinite(expires) && expires > Date.now();
}

export async function stageRecoveryFlash(code: string) {
  const jar = await cookies();
  jar.set(FLASH, code, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 24,
  });
}

export async function readRecoveryFlash(): Promise<string | null> {
  const jar = await cookies();
  const value = jar.get(FLASH)?.value ?? "";
  if (!canonicalRecovery(value)) return null;
  return formatRecovery(canonicalRecovery(value) as string);
}

export async function clearRecoveryFlash() {
  const jar = await cookies();
  jar.delete(FLASH);
}
