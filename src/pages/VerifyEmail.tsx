import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, RefreshCw, ArrowLeft } from 'lucide-react';
// import { storage } from '../lib/storage';
// import { hashToken, isTokenExpired } from '../lib/tokens';
// import { createEmailService, createConfirmationEmail, defaultEmailConfig } from '../lib/email';
// import { emailResendLimiter } from '../lib/rateLimit';
// import { generateToken } from '../lib/tokens';
import { notifications } from '../lib/notifications';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [isResending, setIsResending] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    verifyToken(token);
  }, [token]);

  const verifyToken = async (token: string) => {
    try {
      // Simulate token verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (token && token.length > 10) {
        setUserEmail('user@example.edu');
        setStatus('success');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login?verified=1');
        }, 3000);
      } else {
        setStatus('error');
      }

    } catch (error) {
      console.error('Token verification error:', error);
      setStatus('error');
    }
  };

  const handleResendEmail = async () => {
    if (!userEmail) return;

    setIsResending(true);

    try {
      // Simulate resend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      notifications.success('Email Sent', 'A new verification email has been sent');
      setStatus('loading');
      
    } catch (error) {
      console.error('Resend error:', error);
      notifications.error('Resend Failed', 'Something went wrong. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <RefreshCw className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Verifying Email...
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Please wait while we verify your email address.
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Email Verified!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your email has been successfully verified. You can now log in to your account.
            </p>
            <div className="space-y-4">
              <Link
                to="/login?verified=1"
                className="block w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Go to Login
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                You will be redirected automatically in a few seconds...
              </p>
            </div>
          </div>
        );

      case 'expired':
        return (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <XCircle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Link Expired
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              This verification link has expired. Please request a new one.
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
                  'Resend Verification Email'
                )}
              </button>
              <Link
                to="/signup"
                className="block w-full text-center text-primary-600 hover:text-primary-700 font-medium py-2 transition-colors"
              >
                Back to Signup
              </Link>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Verification Failed
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              This verification link is invalid or has already been used.
            </p>
            <div className="space-y-4">
              <Link
                to="/signup"
                className="block w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Sign Up Again
              </Link>
              <Link
                to="/"
                className="block w-full text-center text-primary-600 hover:text-primary-700 font-medium py-2 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>

          {/* Content */}
          {renderContent()}
        </div>
      </motion.div>
    </div>
  );
}
