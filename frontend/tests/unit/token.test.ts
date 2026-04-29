import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { generateToken, parseToken, isTokenValid } from '../../src/utils/token';

describe('Token Utility', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01').getTime());
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('generateToken', () => {
    it('should generate a token with timestamp and signature', () => {
      const token = generateToken();
      expect(token).toHaveProperty('token');
      expect(token).toHaveProperty('timestamp');
      expect(token).toHaveProperty('signature');
      expect(typeof token.timestamp).toBe('number');
      expect(typeof token.token).toBe('string');
      expect(typeof token.signature).toBe('string');
    });

    it('should generate a token with custom data', () => {
      const customData = { userId: '123', role: 'admin' };
      const token = generateToken(customData);
      expect(token.data).toEqual(customData);
      expect(token.data?.userId).toBe('123');
      expect(token.data?.role).toBe('admin');
    });

    it('should generate unique tokens on each call', () => {
      const token1 = generateToken();
      const token2 = generateToken();
      expect(token1.token).not.toBe(token2.token);
      expect(token1.signature).not.toBe(token2.signature);
    });

    it('should generate tokens within a reasonable time', () => {
      const token = generateToken();
      const now = Date.now();
      const tokenTime = token.timestamp;
      const timeDiff = Math.abs(now - tokenTime);
      expect(timeDiff).toBeLessThan(5000); // Within 5 seconds
    });

    it('should have a valid token format (base64 encoded)', () => {
      const token = generateToken();
      expect(() => {
        atob(token.token.split('.')[1]); // Try to decode the payload
      }).not.toThrow();
    });
  });

  describe('parseToken', () => {
    it('should parse a valid token string', () => {
      const token = generateToken();
      const parsed = parseToken(token.token);
      expect(parsed).not.toBeNull();
      expect(parsed?.token).toBe(token.token);
      expect(parsed?.timestamp).toBe(token.timestamp);
    });

    it('should return null for invalid token format', () => {
      const parsed = parseToken('invalid-token');
      expect(parsed).toBeNull();
    });

    it('should return null for malformed token', () => {
      const parsed = parseToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid');
      expect(parsed).toBeNull();
    });

    it('should return null for empty token', () => {
      const parsed = parseToken('');
      expect(parsed).toBeNull();
    });
  });

  describe('isTokenValid', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return true for valid token with recent timestamp', () => {
      const token = generateToken();
      expect(isTokenValid(token.token)).toBe(true);
    });

    it('should return false for expired token (older than 30 seconds)', () => {
      jest.setSystemTime(Date.now() - 35 * 1000); // 35 seconds ago
      const token = generateToken();
      jest.setSystemTime(Date.now()); // Reset to current
      expect(isTokenValid(token.token)).toBe(false);
    });

    it('should return false for invalid token format', () => {
      expect(isTokenValid('invalid')).toBe(false);
    });

    it('should return false for expired token string', () => {
      const oldTimestamp = Date.now() - 35 * 1000;
      const payload = { timestamp: oldTimestamp, signature: 'old-signature' };
      const token = `${btoa(JSON.stringify({ header: {}, payload }))}.${btoa(JSON.stringify({ signature: 'old-signature' }))}`;
      expect(isTokenValid(token)).toBe(false);
    });

    it('should use custom expiry time if provided', () => {
      jest.setSystemTime(Date.now() - 35 * 1000);
      const token = generateToken();
      jest.setSystemTime(Date.now());

      const expiredToken = parseToken(token.token);
      if (expiredToken) {
        expect(isTokenValid(token.token, 30)).toBe(false); // Should be expired
        expect(isTokenValid(token.token, 60)).toBe(true);  // 60 seconds should work
      }
    });
  });

  describe('Token Signature Validation', () => {
    it('should generate valid signatures', () => {
      const token = generateToken();
      expect(token.signature.length).toBeGreaterThan(0));
    });

    it('should have unique signatures for same timestamp', () => {
      const token1 = generateToken();
      const token2 = generateToken();

      if (token1.timestamp === token2.timestamp) {
        expect(token1.signature).not.toBe(token2.signature);
      }
    });
  });
});
