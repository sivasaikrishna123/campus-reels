// Simple in-memory rate limiting for development
// In production, use Redis or similar

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const entry = rateLimitStore.get(identifier);

    if (!entry || now > entry.resetTime) {
      // Create new entry or reset expired entry
      rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + this.config.windowMs
      });
      return true;
    }

    if (entry.count >= this.config.maxRequests) {
      return false;
    }

    entry.count++;
    return true;
  }

  getRemainingTime(identifier: string): number {
    const entry = rateLimitStore.get(identifier);
    if (!entry) return 0;
    
    const now = Date.now();
    return Math.max(0, entry.resetTime - now);
  }

  reset(identifier: string): void {
    rateLimitStore.delete(identifier);
  }
}

// Pre-configured rate limiters
export const emailResendLimiter = new RateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 5 // 5 requests per hour
});

export const signupLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 3 // 3 signups per 15 minutes
});

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes
