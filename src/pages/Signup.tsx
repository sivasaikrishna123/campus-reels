import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User, GraduationCap, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { SignupFormData, University } from '../types';
import { UniversitySelect } from '../components/auth/UniversitySelect';
import { validators } from '../lib/validation';
import { notifications } from '../lib/notifications';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: '',
    password: '',
    confirmPassword: '',
    university: '',
    graduationMonth: 1,
    graduationYear: new Date().getFullYear() + 1,
    universityEmail: ''
  });
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from({ length: 8 }, (_, i) => currentYear + i);
  const months = [
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

  const handleInputChange = (field: keyof SignupFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateEmailDomain = (email: string, university: University | null): string | null => {
    if (!university) return null;
    
    const emailDomain = email.split('@')[1]?.toLowerCase();
    if (!emailDomain) return 'Invalid email format';

    // Check if university has a primary domain
    if (university.primaryDomain) {
      if (emailDomain !== university.primaryDomain.toLowerCase()) {
        return `Email must be from ${university.primaryDomain}`;
      }
    } else {
      // Check for common academic domains
      const academicDomains = ['.edu', '.ac.uk', '.ac.ca', '.ac.au', '.ac.nz'];
      const hasAcademicDomain = academicDomains.some(domain => emailDomain.endsWith(domain));
      if (!hasAcademicDomain) {
        return 'Please use your university email address (.edu or similar)';
      }
    }

    return null;
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Full name validation
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 10) {
      errors.password = 'Password must be at least 10 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain uppercase, lowercase, and number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // University validation
    if (!formData.university.trim()) {
      errors.university = 'Please select your university';
    }

    // Email validation
    if (!formData.universityEmail.trim()) {
      errors.universityEmail = 'University email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.universityEmail)) {
      errors.universityEmail = 'Please enter a valid email address';
    } else {
      const domainError = validateEmailDomain(formData.universityEmail, selectedUniversity);
      if (domainError) {
        errors.universityEmail = domainError;
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      notifications.error('Validation Error', 'Please fix the errors below');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real app, this would call your API
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     fullName: formData.fullName.trim(),
      //     password: formData.password,
      //     university: formData.university.trim(),
      //     graduationMonth: formData.graduationMonth,
      //     graduationYear: formData.graduationYear,
      //     universityEmail: formData.universityEmail.trim()
      //   })
      // });

      setShowSuccess(true);
      notifications.success(
        'Account Created', 
        'Please check your email to verify your account'
      );

    } catch (error) {
      notifications.error('Signup Failed', 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </motion.div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Check Your Email
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We've sent a verification link to <strong>{formData.universityEmail}</strong>. 
              Please click the link to activate your account.
            </p>
            
            <div className="space-y-3">
              <Button
                onClick={() => navigate('/login')}
                className="w-full"
              >
                Go to Login
              </Button>
              
              <button
                onClick={() => setShowSuccess(false)}
                className="w-full text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Didn't receive the email? Try again
              </button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to CampusReels
            </Link>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Create Your Account
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Join CampusReels and connect with your university community
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Enter your full name"
                disabled={isSubmitting}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                  validationErrors.fullName ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {validationErrors.fullName && (
                <div className="flex items-center space-x-2 mt-2 text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{validationErrors.fullName}</span>
                </div>
              )}
            </div>

            {/* University Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <GraduationCap className="w-4 h-4 inline mr-2" />
                University
              </label>
              <UniversitySelect
                value={formData.university}
                onChange={(value) => handleInputChange('university', value)}
                onUniversitySelect={setSelectedUniversity}
                error={validationErrors.university}
                disabled={isSubmitting}
              />
            </div>

            {/* Graduation Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Graduation Month
                </label>
                <select
                  value={formData.graduationMonth}
                  onChange={(e) => handleInputChange('graduationMonth', parseInt(e.target.value))}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {months.map(month => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Graduation Year
                </label>
                <select
                  value={formData.graduationYear}
                  onChange={(e) => handleInputChange('graduationYear', parseInt(e.target.value))}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                <Mail className="w-4 h-4 inline mr-2" />
                University Email
              </label>
              <input
                type="email"
                value={formData.universityEmail}
                onChange={(e) => handleInputChange('universityEmail', e.target.value)}
                placeholder="your.email@university.edu"
                disabled={isSubmitting}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                  validationErrors.universityEmail ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {validationErrors.universityEmail && (
                <div className="flex items-center space-x-2 mt-2 text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{validationErrors.universityEmail}</span>
                </div>
              )}
              {selectedUniversity?.primaryDomain && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Use your {selectedUniversity.primaryDomain} email address
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Create a strong password"
                disabled={isSubmitting}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                  validationErrors.password ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {validationErrors.password && (
                <div className="flex items-center space-x-2 mt-2 text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{validationErrors.password}</span>
                </div>
              )}
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Must be at least 10 characters with uppercase, lowercase, and number
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Confirm Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirm your password"
                disabled={isSubmitting}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                  validationErrors.confirmPassword ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {validationErrors.confirmPassword && (
                <div className="flex items-center space-x-2 mt-2 text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{validationErrors.confirmPassword}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
