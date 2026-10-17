import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24;

function signExpiry(expiresAt: string, secret: string) {
  return createHmac("sha256", secret).update(expiresAt).digest("base64url");
}

export function createAdminSessionToken() {
  const secret = process.env.ADMIN_PANEL_PASSWORD;
  if (!secret) throw new Error("Admin password is not configured");

  const expiresAt = String(Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE_SECONDS);
  return `${expiresAt}.${signExpiry(expiresAt, secret)}`;
}

export function isValidAdminSessionToken(token: string | undefined) {
  const secret = process.env.ADMIN_PANEL_PASSWORD;
  if (!token || !secret) return false;

  const [expiresAt, signature, extraPart] = token.split(".");
  if (!expiresAt || !signature || extraPart || !/^\d+$/.test(expiresAt)) return false;
  if (Number(expiresAt) <= Math.floor(Date.now() / 1000)) return false;

  const expected = Buffer.from(signExpiry(expiresAt, secret));
  const actual = Buffer.from(signature);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}