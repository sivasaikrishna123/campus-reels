import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Briefcase } from 'lucide-react';
import { Job } from '../../types';
import { ApplyModal } from './ApplyModal';

interface ApplyFABProps {
  onApply: (job: Job) => void;
}

export const ApplyFAB: React.FC<ApplyFABProps> = ({ onApply }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedJob(null);
  };

  const handleSubmit = (applicationData: any) => {
    if (selectedJob) {
      onApply(selectedJob);
    }
    handleClose();
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => {
          // For demo purposes, we'll show a quick apply modal
          // In a real app, this might open a job selection modal
          const demoJob: Job = {
            id: 'quick-apply',
            title: 'Quick Apply',
            department: 'General',
            jobType: 'TA',
            description: 'Apply to multiple positions at once',
            requirements: [],
            payRate: 0,
            hoursPerWeek: 0,
            startDate: '',
            endDate: '',
            applicationDeadline: '',
            postedDate: '',
            tags: [],
            contactEmail: '',
            isRemote: false
          };
          handleApply(demoJob);
        }}
        className="fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="plus"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Plus className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 right-20 z-30 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg"
      >
        Quick Apply
        <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
      </motion.div>

      {/* Apply Modal */}
      <ApplyModal
        isOpen={isOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        job={selectedJob}
        isQuickApply={true}
      />
    </>
  );
};
