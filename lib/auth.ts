import crypto from 'crypto';
import { cookies } from 'next/headers';

const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'ab-labs-production-secret-session-key-2026';
const CLIENT_COOKIE_NAME = 'ab_client_session';
const ADMIN_COOKIE_NAME = 'ab_admin_session';

// --- Password Hashing (PBKDF2) ---

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, originalHash] = storedHash.split(':');
  const checkHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(checkHash, 'hex'), Buffer.from(originalHash, 'hex'));
}

export function generateFriendlyPassword(): string {
  const digits = crypto.randomInt(1000, 10000);
  const words = ['Launch', 'Build', 'Ready', 'Fast', 'Apex', 'Nova', 'Pulse'];
  const word = words[crypto.randomInt(0, words.length)];
  return `Ab-${digits}-${word}`;
}

// --- Signed Session Tokens ---

interface ClientSessionPayload {
  clientId: string;
  email: string;
  role: 'client';
  exp: number;
}

interface AdminSessionPayload {
  role: 'admin';
  exp: number;
}

function signPayload(payloadStr: string): string {
  const hmac = crypto.createHmac('sha256', SESSION_SECRET);
  hmac.update(payloadStr);
  return hmac.digest('base64url');
}

export function createClientToken(clientId: string, email: string): string {
  const payload: ClientSessionPayload = {
    clientId,
    email: email.toLowerCase().trim(),
    role: 'client',
    exp: Date.now() + 1000 * 60 * 60 * 24 * 30, // 30 days
  };
  const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = signPayload(payloadEncoded);
  return `${payloadEncoded}.${signature}`;
}

export function verifyClientToken(token: string): ClientSessionPayload | null {
  try {
    const [payloadEncoded, signature] = token.split('.');
    if (!payloadEncoded || !signature) return null;
    const expectedSignature = signPayload(payloadEncoded);
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }
    const payload: ClientSessionPayload = JSON.parse(Buffer.from(payloadEncoded, 'base64url').toString('utf-8'));
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function createAdminToken(): string {
  const payload: AdminSessionPayload = {
    role: 'admin',
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  };
  const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = signPayload(payloadEncoded);
  return `${payloadEncoded}.${signature}`;
}

export function verifyAdminToken(token: string): boolean {
  try {
    const [payloadEncoded, signature] = token.split('.');
    if (!payloadEncoded || !signature) return false;
    const expectedSignature = signPayload(payloadEncoded);
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return false;
    }
    const payload: AdminSessionPayload = JSON.parse(Buffer.from(payloadEncoded, 'base64url').toString('utf-8'));
    return payload.role === 'admin' && payload.exp > Date.now();
  } catch {
    return false;
  }
}

// --- Cookie Setters & Getters (Next.js App Router) ---

export async function setClientSessionCookie(clientId: string, email: string) {
  const token = createClientToken(clientId, email);
  const cookieStore = await cookies();
  cookieStore.set(CLIENT_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return token;
}

export async function getClientSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CLIENT_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyClientToken(token);
}

export async function clearClientSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(CLIENT_COOKIE_NAME);
}

export async function setAdminSessionCookie() {
  const token = createAdminToken();
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return token;
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
