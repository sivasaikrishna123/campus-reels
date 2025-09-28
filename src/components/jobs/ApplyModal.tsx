import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, Calendar, Link, AlertCircle, CheckCircle } from 'lucide-react';
import { Job, Application } from '../../types';
import { validators } from '../../lib/validation';
import { notifications } from '../../lib/notifications';
import Button from '../ui/Button';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (applicationData: any) => void;
  job?: Job | null;
  isQuickApply?: boolean;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  job,
  isQuickApply = false
}) => {
  const [formData, setFormData] = useState({
    resume: null as File | null,
    coverLetter: '',
    notes: '',
    postingUrl: '',
    deadline: ''
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file
      const validationError = validateFile(file);
      
      if (validationError) {
        notifications.error('Invalid File', validationError);
        return;
      }

      setFormData(prev => ({ ...prev, resume: file }));
      setValidationErrors(prev => ({ ...prev, resume: '' }));
      notifications.success('File Selected', `${file.name} is ready for upload`);
    }
  };

  const validateFile = (file: File): string | null => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (file.size > maxSize) {
      return 'File size must be less than 5MB';
    }
    
    if (!allowedTypes.includes(file.type)) {
      return 'Only PDF and Word documents are allowed';
    }
    
    return null;
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.resume) {
      errors.resume = 'Resume is required';
    }

    if (formData.coverLetter.trim().length < 50) {
      errors.coverLetter = 'Cover letter must be at least 50 characters';
    }

    if (formData.postingUrl && !isValidUrl(formData.postingUrl)) {
      errors.postingUrl = 'Please enter a valid URL';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
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
      // Simulate file upload
      const resumeUrl = formData.resume ? 
        `uploads/resume_${Date.now()}_${formData.resume.name}` : 
        undefined;

      const applicationData = {
        resumeUrl,
        coverLetter: formData.coverLetter.trim(),
        notes: formData.notes.trim(),
        postingUrl: formData.postingUrl.trim() || undefined,
        deadline: formData.deadline || undefined
      };

      onSubmit(applicationData);
      
      notifications.success(
        'Application Submitted', 
        'Your application has been submitted successfully!'
      );

      // Reset form
      setFormData({
        resume: null,
        coverLetter: '',
        notes: '',
        postingUrl: '',
        deadline: ''
      });
      setValidationErrors({});

    } catch (error) {
      notifications.error('Submission Failed', 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {isQuickApply ? 'Quick Apply' : `Apply to ${job?.title}`}
                </h2>
                {job && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {job.department} • {job.jobType}
                  </p>
                )}
              </div>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Resume <span className="text-red-500">*</span>
                </label>
                <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                  validationErrors.resume 
                    ? 'border-red-300 bg-red-50 dark:bg-red-900/20' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
                }`}>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="resume-upload"
                    disabled={isSubmitting}
                  />
                  <label
                    htmlFor="resume-upload"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    {formData.resume ? (
                      <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                        <CheckCircle className="w-8 h-8" />
                        <div>
                          <p className="font-medium">{formData.resume.name}</p>
                          <p className="text-sm">{(formData.resume.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center space-y-2">
                        <Upload className="w-8 h-8 text-gray-400" />
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Click to upload resume</p>
                          <p className="text-sm text-gray-500">PDF, DOC, DOCX up to 5MB</p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
                {validationErrors.resume && (
                  <div className="flex items-center space-x-2 mt-2 text-red-600 dark:text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{validationErrors.resume}</span>
                  </div>
                )}
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cover Letter <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.coverLetter}
                  onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                  placeholder="Write a brief cover letter explaining your interest and qualifications..."
                  rows={6}
                  disabled={isSubmitting}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                    validationErrors.coverLetter ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                <div className="flex justify-between items-center mt-1">
                  {validationErrors.coverLetter && (
                    <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{validationErrors.coverLetter}</span>
                    </div>
                  )}
                  <span className="text-sm text-gray-500 ml-auto">
                    {formData.coverLetter.length}/500 characters
                  </span>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Any additional information you'd like to include..."
                  rows={3}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              {/* Posting URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Link className="w-4 h-4 inline mr-1" />
                  Job Posting URL
                </label>
                <input
                  type="url"
                  value={formData.postingUrl}
                  onChange={(e) => handleInputChange('postingUrl', e.target.value)}
                  placeholder="https://..."
                  disabled={isSubmitting}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                    validationErrors.postingUrl ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {validationErrors.postingUrl && (
                  <div className="flex items-center space-x-2 mt-2 text-red-600 dark:text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{validationErrors.postingUrl}</span>
                  </div>
                )}
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Application Deadline
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleInputChange('deadline', e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </form>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  'Submit Application'
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
