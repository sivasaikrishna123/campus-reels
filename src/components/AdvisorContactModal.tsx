import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Clock, MapPin, MessageSquare, Send, AlertCircle, CheckCircle, Globe } from 'lucide-react';
import { Advisor, AdvisorRequestFormData } from '../types';
import { storage } from '../lib/storage';
import { validators } from '../lib/validation';
import { notifications } from '../lib/notifications';
import Button from './ui/Button';
import Avatar from './ui/Avatar';

interface AdvisorContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdvisorContactModal: React.FC<AdvisorContactModalProps> = ({ isOpen, onClose }) => {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const [formData, setFormData] = useState<AdvisorRequestFormData>({
    advisorId: '',
    message: '',
    preferredSlots: ''
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const advisorsData = storage.getAdvisors();
      setAdvisors(advisorsData);
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof AdvisorRequestFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAdvisorSelect = (advisor: Advisor) => {
    setSelectedAdvisor(advisor);
    setFormData(prev => ({ ...prev, advisorId: advisor.id }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.advisorId) {
      errors.advisorId = 'Please select an advisor';
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
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
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real app, this would call your API
      // const response = await fetch('/api/advisors/request', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      setShowSuccess(true);
      notifications.success(
        'Request Sent', 
        `Your request has been sent to ${selectedAdvisor?.name}`
      );

    } catch (error) {
      notifications.error('Request Failed', 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedAdvisor(null);
      setFormData({ advisorId: '', message: '', preferredSlots: '' });
      setValidationErrors({});
      setShowSuccess(false);
      onClose();
    }
  };

  const formatOfficeHours = (advisor: Advisor) => {
    return advisor.officeHours.map(hours => 
      `${hours.day}: ${hours.startTime}-${hours.endTime} ${hours.isVirtual ? '(Virtual)' : `(${hours.location})`}`
    ).join(', ');
  };

  const getCurrentTime = (timezone: string) => {
    return new Date().toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit'
    });
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
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Contact an Advisor
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get help from university advisors
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {showSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </motion.div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Request Sent Successfully!
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Your request has been sent to <strong>{selectedAdvisor?.name}</strong>.
                  </p>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      <strong>What's next?</strong><br />
                      The advisor will review your request and respond within 24 hours. 
                      You'll receive updates via email.
                    </p>
                  </div>
                  
                  <Button onClick={handleClose} className="w-full">
                    Close
                  </Button>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  {/* Advisor Selection */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Select an Advisor
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {advisors.map((advisor) => (
                        <motion.button
                          key={advisor.id}
                          onClick={() => handleAdvisorSelect(advisor)}
                          className={`p-4 border rounded-lg text-left transition-all ${
                            selectedAdvisor?.id === advisor.id
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-start space-x-3">
                            <Avatar
                              src={advisor.avatar || ''}
                              alt={advisor.name}
                              size="md"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {advisor.name}
                                </h4>
                                <div className={`w-2 h-2 rounded-full ${
                                  advisor.isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                                }`}></div>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  advisor.isOnline 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                }`}>
                                  {advisor.isOnline ? 'Online' : 'Offline'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {advisor.department}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                                {advisor.bio}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {advisor.specialties.slice(0, 3).map((specialty, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                                  >
                                    {specialty}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Advisor Details */}
                  {selectedAdvisor && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                        {selectedAdvisor.name} - Office Hours
                      </h4>
                      <div className="space-y-2">
                        {selectedAdvisor.officeHours.map((hours, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700 dark:text-gray-300">
                              {hours.day}: {hours.startTime}-{hours.endTime}
                            </span>
                            {hours.isVirtual ? (
                              <Globe className="w-4 h-4 text-blue-500" />
                            ) : (
                              <MapPin className="w-4 h-4 text-gray-500" />
                            )}
                            <span className="text-gray-500">
                              {hours.isVirtual ? 'Virtual' : hours.location}
                            </span>
                          </div>
                        ))}
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>Current time: {getCurrentTime(selectedAdvisor.timezone)}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Request Form */}
                  {selectedAdvisor && (
                    <motion.form
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Send Request to {selectedAdvisor.name}
                      </h3>

                      {/* Message */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <MessageSquare className="w-4 h-4 inline mr-2" />
                          Message
                        </label>
                        <textarea
                          value={formData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          placeholder="Describe what you need help with..."
                          rows={4}
                          disabled={isSubmitting}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                            validationErrors.message ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                          }`}
                        />
                        {validationErrors.message && (
                          <div className="flex items-center space-x-2 mt-2 text-red-600 dark:text-red-400">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm">{validationErrors.message}</span>
                          </div>
                        )}
                      </div>

                      {/* Preferred Time Slots */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <Clock className="w-4 h-4 inline mr-2" />
                          Preferred Time Slots (Optional)
                        </label>
                        <textarea
                          value={formData.preferredSlots}
                          onChange={(e) => handleInputChange('preferredSlots', e.target.value)}
                          placeholder="e.g., Monday 2-4 PM, Wednesday morning, Friday afternoon..."
                          rows={2}
                          disabled={isSubmitting}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Sending Request...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-2">
                            <Send className="w-4 h-4" />
                            <span>Send Request</span>
                          </div>
                        )}
                      </Button>
                    </motion.form>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
