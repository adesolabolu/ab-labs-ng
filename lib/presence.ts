/**
 * Shared In-Memory Presence Tracker for Real-Time Online User Analytics
 */

export interface ActiveVisitor {
  sessionId: string;
  pathname: string;
  clientEmail?: string | null;
  clientName?: string | null;
  isLoggedIn: boolean;
  userAgent?: string;
  ip?: string;
  lastSeen: number;
}

// Global variable to survive HMR in dev and persist in Node server runtime
declare global {
  var __abLabsPresenceMap: Map<string, ActiveVisitor> | undefined;
}

const presenceMap: Map<string, ActiveVisitor> =
  global.__abLabsPresenceMap || (global.__abLabsPresenceMap = new Map());

const TTL_MS = 3 * 60 * 1000; // 3 minutes

export function recordPresence(visitor: Omit<ActiveVisitor, 'lastSeen'>) {
  const now = Date.now();
  presenceMap.set(visitor.sessionId, {
    ...visitor,
    lastSeen: now,
  });

  // Prune expired sessions
  for (const [id, session] of presenceMap.entries()) {
    if (now - session.lastSeen > TTL_MS) {
      presenceMap.delete(id);
    }
  }
}

export function getActiveVisitors(): ActiveVisitor[] {
  const now = Date.now();
  const active: ActiveVisitor[] = [];

  for (const [id, session] of presenceMap.entries()) {
    if (now - session.lastSeen <= TTL_MS) {
      active.push(session);
    } else {
      presenceMap.delete(id);
    }
  }

  return active.sort((a, b) => b.lastSeen - a.lastSeen);
}
