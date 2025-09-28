// API simulation for React/Vite environment
// In a real Next.js app, these would be actual API routes

import { storage } from './storage';
import { generateToken, hashToken } from './tokens';
import { createEmailService, createConfirmationEmail, defaultEmailConfig } from './email';
import { emailResendLimiter } from './rateLimit';
import { resendEmailSchema } from './validators';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Simulate API delay
const simulateApiCall = async (delay: number = 1000) => {
  await new Promise(resolve => setTimeout(resolve, delay));
};

export const api = {
  // Resend verification email
  async resendVerificationEmail(email: string): Promise<ApiResponse> {
    try {
      await simulateApiCall(500);

      // Validate input
      const validation = resendEmailSchema.safeParse({ universityEmail: email });
      if (!validation.success) {
        return {
          success: false,
          error: 'Invalid email address'
        };
      }

      // Rate limiting
      const rateLimitKey = `resend_${email}`;
      if (!emailResendLimiter.isAllowed(rateLimitKey)) {
        const remainingTime = emailResendLimiter.getRemainingTime(rateLimitKey);
        const minutes = Math.ceil(remainingTime / (1000 * 60));
        return {
          success: false,
          error: `Please wait ${minutes} minutes before requesting another email`
        };
      }

      // Find user
      const user = storage.getAuthUserByEmail(email);
      if (!user || user.status !== 'PENDING_EMAIL') {
        // Always return success to prevent user enumeration
        return {
          success: true,
          message: 'If an account exists with this email, a verification email has been sent'
        };
      }

      // Invalidate old tokens
      const oldTokens = storage.getEmailTokens().filter(token => token.userId === user.id);
      oldTokens.forEach(token => storage.deleteEmailToken(token.id));

      // Generate new token
      const tokenData = generateToken(24);
      const emailToken = {
        id: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.id,
        tokenHash: tokenData.hash,
        expiresAt: tokenData.expiresAt.toISOString(),
        createdAt: new Date().toISOString()
      };

      storage.addEmailToken(emailToken);

      // Send email
      const emailService = createEmailService(defaultEmailConfig);
      const verificationUrl = `${defaultEmailConfig.appUrl}/verify?token=${tokenData.plaintext}`;
      const emailTemplate = createConfirmationEmail(
        email,
        user.fullName,
        verificationUrl,
        defaultEmailConfig.supportEmail
      );

      const emailSent = await emailService.sendEmail(emailTemplate);
      
      if (emailSent) {
        return {
          success: true,
          message: 'Verification email sent successfully'
        };
      } else {
        return {
          success: false,
          error: 'Failed to send email. Please try again.'
        };
      }

    } catch (error) {
      console.error('Resend email error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred'
      };
    }
  },

  // Verify email token
  async verifyEmailToken(token: string): Promise<ApiResponse> {
    try {
      await simulateApiCall(300);

      if (!token) {
        return {
          success: false,
          error: 'Token is required'
        };
      }

      // Hash the token to compare with stored hash
      const tokenHash = hashToken(token);
      
      // Find the token in storage
      const emailTokens = storage.getEmailTokens();
      const emailToken = emailTokens.find(t => t.tokenHash === tokenHash);
      
      if (!emailToken) {
        return {
          success: false,
          error: 'Invalid or expired token'
        };
      }

      // Check if token is expired
      const expiresAt = new Date(emailToken.expiresAt);
      if (new Date() > expiresAt) {
        return {
          success: false,
          error: 'Token has expired'
        };
      }

      // Find the user
      const user = storage.getAuthUserByEmail(emailToken.userId);
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      // Update user status to ACTIVE
      const updatedUser = {
        ...user,
        status: 'ACTIVE' as const,
        updatedAt: new Date().toISOString()
      };

      storage.updateAuthUser(updatedUser);

      // Delete the used token
      storage.deleteEmailToken(emailToken.id);

      return {
        success: true,
        message: 'Email verified successfully',
        data: {
          userId: user.id,
          email: user.universityEmail
        }
      };

    } catch (error) {
      console.error('Token verification error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred'
      };
    }
  },

  // Register new user
  async registerUser(userData: {
    fullName: string;
    password: string;
    university: string;
    graduationMonth: number;
    graduationYear: number;
    universityEmail: string;
  }): Promise<ApiResponse> {
    try {
      await simulateApiCall(1000);

      // Check if user already exists
      const existingUser = storage.getAuthUserByEmail(userData.universityEmail);
      if (existingUser) {
        return {
          success: false,
          error: 'An account with this email already exists'
        };
      }

      // Hash password (simplified for browser compatibility)
      const passwordHash = btoa(userData.password); // Simple base64 encoding for demo

      // Generate verification token
      const tokenData = generateToken(24);

      // Create user
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newUser = {
        id: userId,
        fullName: userData.fullName.trim(),
        passwordHash,
        university: userData.university,
        graduationMonth: userData.graduationMonth,
        graduationYear: userData.graduationYear,
        universityEmail: userData.universityEmail.toLowerCase(),
        status: 'PENDING_EMAIL' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Create email verification token
      const emailToken = {
        id: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        tokenHash: tokenData.hash,
        expiresAt: tokenData.expiresAt.toISOString(),
        createdAt: new Date().toISOString()
      };

      // Save to storage
      storage.addAuthUser(newUser);
      storage.addEmailToken(emailToken);

      // Send confirmation email
      const emailService = createEmailService(defaultEmailConfig);
      const verificationUrl = `${defaultEmailConfig.appUrl}/verify?token=${tokenData.plaintext}`;
      const emailTemplate = createConfirmationEmail(
        userData.universityEmail,
        userData.fullName,
        verificationUrl,
        defaultEmailConfig.supportEmail
      );

      const emailSent = await emailService.sendEmail(emailTemplate);
      
      return {
        success: true,
        message: 'Account created successfully. Please check your email to verify your account.',
        data: {
          userId,
          emailSent
        }
      };

    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during registration'
      };
    }
  }
};
