// Email service with Resend and Nodemailer fallback
// For React/Vite, we'll simulate email sending since we can't use server-side APIs directly

import { env } from '../config/env';

export interface EmailConfig {
  resendApiKey?: string;
  smtp?: {
    host: string;
    port: number;
    user: string;
    pass: string;
    secure: boolean;
  };
  supportEmail: string;
  appUrl: string;
}

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Mock email service for development
class MockEmailService {
  private sentEmails: EmailTemplate[] = [];

  async sendEmail(template: EmailTemplate): Promise<boolean> {
    // In development, log to console and store in memory
    console.log('📧 Email sent:', {
      to: template.to,
      subject: template.subject,
      // timestamp: new Date().toISOString() // Removed for compatibility
    });
    
    this.sentEmails.push({
      ...template,
      // timestamp: new Date().toISOString() // Removed for compatibility
    });

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return true;
  }

  getSentEmails(): EmailTemplate[] {
    return [...this.sentEmails];
  }

  clearSentEmails(): void {
    this.sentEmails = [];
  }
}

// Production email service (would use Resend/Nodemailer)
class ProductionEmailService {
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
  }

  async sendEmail(template: EmailTemplate): Promise<boolean> {
    try {
      // Try Resend first if API key is available
      if (this.config.resendApiKey) {
        return await this.sendWithResend(template);
      }

      // Fallback to SMTP
      if (this.config.smtp) {
        return await this.sendWithSMTP(template);
      }

      throw new Error('No email service configured');
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  private async sendWithResend(template: EmailTemplate): Promise<boolean> {
    // This would be the actual Resend API call
    // For now, we'll simulate it
    console.log('📧 Sending with Resend:', template.to);
    return true;
  }

  private async sendWithSMTP(template: EmailTemplate): Promise<boolean> {
    // This would be the actual SMTP call
    // For now, we'll simulate it
    console.log('📧 Sending with SMTP:', template.to);
    return true;
  }
}

// Email service factory
export function createEmailService(config: EmailConfig) {
  const isDevelopment = import.meta.env.DEV;
  
  if (isDevelopment) {
    return new MockEmailService();
  }
  
  return new ProductionEmailService(config);
}

// Email templates
export function createConfirmationEmail(
  email: string,
  name: string,
  verificationUrl: string,
  supportEmail: string
): EmailTemplate {
  const subject = 'Confirm your university email - CampusReels';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e1e5e9; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
        .button:hover { background: #2563eb; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 14px; color: #64748b; border-radius: 0 0 8px 8px; }
        .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to CampusReels!</h1>
        </div>
        <div class="content">
          <h2>Hi ${name}!</h2>
          <p>Thank you for signing up for CampusReels. To complete your registration, please confirm your university email address.</p>
          
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">Confirm Email Address</a>
          </div>
          
          <div class="warning">
            <strong>⏰ This link expires in 24 hours</strong>
            <p>If you don't confirm your email within 24 hours, you'll need to sign up again.</p>
          </div>
          
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background: #f1f5f9; padding: 10px; border-radius: 4px; font-family: monospace;">${verificationUrl}</p>
          
          <p>If you didn't create an account with CampusReels, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          <p>Need help? Contact us at <a href="mailto:${supportEmail}">${supportEmail}</a></p>
          <p>CampusReels - Connecting Students Through Content</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Hi ${name}!

Thank you for signing up for CampusReels. To complete your registration, please confirm your university email address.

Click this link to confirm: ${verificationUrl}

This link expires in 24 hours. If you don't confirm your email within 24 hours, you'll need to sign up again.

If you didn't create an account with CampusReels, you can safely ignore this email.

Need help? Contact us at ${supportEmail}

CampusReels - Connecting Students Through Content
  `;

  return {
    to: email,
    subject,
    html,
    text
  };
}

// Default email configuration
export const defaultEmailConfig: EmailConfig = {
  resendApiKey: env.RESEND_API_KEY,
  smtp: env.SMTP.HOST ? {
    host: env.SMTP.HOST,
    port: env.SMTP.PORT,
    user: env.SMTP.USER,
    pass: env.SMTP.PASS,
    secure: env.SMTP.SECURE
  } : undefined,
  supportEmail: env.SUPPORT_EMAIL,
  appUrl: env.APP_URL
};
