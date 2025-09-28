import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User, GraduationCap, Calendar, CheckCircle, RefreshCw } from 'lucide-react';
import UniversitySelect from '../components/auth/UniversitySelect';
import { signupSchema, validateUniversityEmail } from '../lib/validators';
import { notifications } from '../lib/notifications';
import { storage } from '../lib/storage';
import { generateToken, hashToken } from '../lib/tokens';
import { createEmailService, createConfirmationEmail, defaultEmailConfig } from '../lib/email';
import { emailResendLimiter } from '../lib/rateLimit';
// import bcrypt from 'bcryptjs'; // Temporarily disabled for browser compatibility

interface SignupFormData {
  fullName: string;
  password: string;
  confirmPassword: string;
  university: string;
  graduationMonth: number;
  graduationYear: number;
  universityEmail: string;
}

interface ValidationErrors {
  fullName?: string;
  password?: string;
  confirmPassword?: string;
  university?: string;
  graduationMonth?: string;
  graduationYear?: string;
  universityEmail?: string;
}

export default function EnhancedSignup() {
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: '',
    password: '',
    confirmPassword: '',
    university: '',
    graduationMonth: 1,
    graduationYear: new Date().getFullYear() + 1,
    universityEmail: ''
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<{ name: string; primaryDomain?: string } | null>(null);

  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from({ length: 8 }, (_, i) => currentYear + i);
  const graduationMonths = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  const handleInputChange = (field: keyof SignupFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleUniversitySelect = (university: string, primaryDomain?: string) => {
    setFormData(prev => ({ ...prev, university }));
    setSelectedUniversity({ name: university, primaryDomain });
    
    if (validationErrors.university) {
      setValidationErrors(prev => ({ ...prev, university: undefined }));
    }
  };

  const validateForm = (): boolean => {
    try {
      // Validate with Zod schema
      signupSchema.parse(formData);
      
      // Additional university email validation
      if (selectedUniversity && !validateUniversityEmail(formData.universityEmail, selectedUniversity)) {
        setValidationErrors(prev => ({
          ...prev,
          universityEmail: `Email must be from ${selectedUniversity.primaryDomain || 'a .edu domain'}`
        }));
        return false;
      }
      
      setValidationErrors({});
      return true;
    } catch (error: any) {
      const errors: ValidationErrors = {};
      
      if (error.errors) {
        error.errors.forEach((err: any) => {
          const field = err.path[0] as keyof ValidationErrors;
          errors[field] = err.message;
        });
      }
      
      setValidationErrors(errors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      notifications.error('Validation Error', 'Please fix the errors below');
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if user already exists
      const existingUser = storage.getAuthUserByEmail(formData.universityEmail);
      if (existingUser) {
        notifications.error('Account Exists', 'An account with this email already exists');
        setIsSubmitting(false);
        return;
      }

      // Hash password (simplified for browser compatibility)
      const passwordHash = btoa(formData.password); // Simple base64 encoding for demo

      // Generate verification token
      const tokenData = generateToken(24); // 24 hours expiry

      // Create user
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newUser = {
        id: userId,
        fullName: formData.fullName.trim(),
        passwordHash,
        university: formData.university,
        graduationMonth: formData.graduationMonth,
        graduationYear: formData.graduationYear,
        universityEmail: formData.universityEmail.toLowerCase(),
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
        formData.universityEmail,
        formData.fullName,
        verificationUrl,
        defaultEmailConfig.supportEmail
      );

      const emailSent = await emailService.sendEmail(emailTemplate);
      
      if (emailSent) {
        setShowSuccess(true);
        notifications.success('Account Created', 'Please check your email to verify your account');
      } else {
        notifications.error('Email Failed', 'Account created but email could not be sent. Please try resending.');
        setShowSuccess(true);
      }
      
    } catch (error) {
      console.error('Signup error:', error);
      notifications.error('Signup Failed', 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendEmail = async () => {
    setIsResending(true);

    try {
      // Rate limiting
      const rateLimitKey = `resend_${formData.universityEmail}`;
      if (!emailResendLimiter.isAllowed(rateLimitKey)) {
        const remainingTime = emailResendLimiter.getRemainingTime(rateLimitKey);
        const minutes = Math.ceil(remainingTime / (1000 * 60));
        notifications.error('Rate Limited', `Please wait ${minutes} minutes before requesting another email`);
        setIsResending(false);
        return;
      }

      // Find user
      const user = storage.getAuthUserByEmail(formData.universityEmail);
      if (!user || user.status !== 'PENDING_EMAIL') {
        notifications.error('Invalid Request', 'No pending verification found for this email');
        setIsResending(false);
        return;
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
        formData.universityEmail,
        user.fullName,
        verificationUrl,
        defaultEmailConfig.supportEmail
      );

      const emailSent = await emailService.sendEmail(emailTemplate);
      
      if (emailSent) {
        notifications.success('Email Sent', 'A new verification email has been sent');
      } else {
        notifications.error('Email Failed', 'Could not send verification email. Please try again.');
      }
      
    } catch (error) {
      console.error('Resend error:', error);
      notifications.error('Resend Failed', 'Something went wrong. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </motion.div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Check Your Email
            </h1>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We've sent a verification link to <strong>{formData.universityEmail}</strong>. 
              Click the link to activate your account.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={handleResendEmail}
                disabled={isResending}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Resend Email'
                )}
              </button>
              
              <Link
                to="/"
                className="block w-full text-center text-primary-600 hover:text-primary-700 font-medium py-2 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link
              to="/"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Join CampusReels
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Create your account to start sharing and discovering campus content
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                    validationErrors.fullName 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                  placeholder="Enter your full name"
                />
              </div>
              {validationErrors.fullName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {validationErrors.fullName}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                    validationErrors.password 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                  placeholder="Create a strong password"
                />
              </div>
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {validationErrors.password}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Must be at least 10 characters with uppercase, lowercase, number, and special character
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                    validationErrors.confirmPassword 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                  placeholder="Confirm your password"
                />
              </div>
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {validationErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* University */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                University
              </label>
              <UniversitySelect
                value={formData.university}
                onChange={handleUniversitySelect}
                error={validationErrors.university}
                placeholder="Search for your university..."
              />
            </div>

            {/* Graduation Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Graduation Month
                </label>
                <select
                  value={formData.graduationMonth}
                  onChange={(e) => handleInputChange('graduationMonth', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {graduationMonths.map(month => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Graduation Year
                </label>
                <select
                  value={formData.graduationYear}
                  onChange={(e) => handleInputChange('graduationYear', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {graduationYears.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* University Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                University Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.universityEmail}
                  onChange={(e) => handleInputChange('universityEmail', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                    validationErrors.universityEmail 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                  placeholder="your.email@university.edu"
                />
              </div>
              {validationErrors.universityEmail && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {validationErrors.universityEmail}
                </p>
              )}
              {selectedUniversity?.primaryDomain && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Email must be from {selectedUniversity.primaryDomain}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
