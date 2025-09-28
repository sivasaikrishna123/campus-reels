// Browser-compatible crypto functions
const getRandomBytes = (length: number): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

const createHash = (data: string): string => {
  // Simple hash function for demo purposes
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
};

export interface TokenData {
  plaintext: string;
  hash: string;
  expiresAt: Date;
}

/**
 * Generate a secure random token and its hash
 */
export function generateToken(expiryHours: number = 24): TokenData {
  const plaintext = getRandomBytes(32);
  const hash = createHash(plaintext);
  const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000);

  return {
    plaintext,
    hash,
    expiresAt
  };
}

/**
 * Hash a token for storage/comparison
 */
export function hashToken(token: string): string {
  return createHash(token);
}

/**
 * Check if a token is expired
 */
export function isTokenExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}

/**
 * Generate a secure random string for various purposes
 */
export function generateSecureString(length: number = 16): string {
  return getRandomBytes(length);
}
