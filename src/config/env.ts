// Environment configuration for CampusReels
// In production, these would come from environment variables

export const env = {
  // App Configuration
  APP_URL: (import.meta as any).env.VITE_APP_URL || 'http://localhost:3000',
  SUPPORT_EMAIL: (import.meta as any).env.VITE_SUPPORT_EMAIL || 'support@campusreels.com',
  
  // Email Configuration
  RESEND_API_KEY: (import.meta as any).env.VITE_RESEND_API_KEY,
  SMTP: {
    HOST: (import.meta as any).env.VITE_SMTP_HOST,
    PORT: parseInt((import.meta as any).env.VITE_SMTP_PORT || '587'),
    USER: (import.meta as any).env.VITE_SMTP_USER,
    PASS: (import.meta as any).env.VITE_SMTP_PASS,
    SECURE: (import.meta as any).env.VITE_SMTP_SECURE === 'true'
  },
  
  // AI Configuration
  GEMINI_KEY: (import.meta as any).env.VITE_GEMINI_KEY,
  
  // Development flags
  IS_DEVELOPMENT: (import.meta as any).env.DEV,
  IS_PRODUCTION: (import.meta as any).env.PROD
};

// Validate required environment variables in production
if (env.IS_PRODUCTION) {
  const requiredVars = [
    'APP_URL',
    'SUPPORT_EMAIL'
  ];
  
  const missingVars = requiredVars.filter(varName => !env[varName as keyof typeof env]);
  
  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars);
  }
}
