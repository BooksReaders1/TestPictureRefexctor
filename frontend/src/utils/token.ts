// Token generation utilities
import type { APIToken } from '@/types';

export function generateToken(): APIToken {
  const timestamp = Date.now();
  const version = '1.0.0';
  const secretKey = 'jm18c-uoe'; // Placeholder - should be configurable

  const token = btoa(`${timestamp}|${version}|${secretKey}`);

  return { timestamp, version, token };
}

export function validateToken(token: APIToken): boolean {
  const now = Date.now();
  const timeDiff = now - token.timestamp;

  // Token is valid for 24 hours (86400000 ms)
  return timeDiff < 86400000;
}
