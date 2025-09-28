import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Calendar, 
  BookOpen, 
  Heart, 
  ExternalLink,
  Briefcase
} from 'lucide-react';
import { Job, ApplicationStatus } from '../../types';
import { storage } from '../../lib/storage';
import { notifications } from '../../lib/notifications';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface JobCardProps {
  job: Job;
  onApply: (job: Job) => void;
  onSave: (jobId: string) => void;
  isSaved?: boolean;
  applicationStatus?: ApplicationStatus;
}

export const JobCard: React.FC<JobCardProps> = ({ 
  job, 
  onApply, 
  onSave, 
  isSaved = false,
  applicationStatus 
}) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      onSave(job.id);
      notifications.success(
        isSaved ? 'Job Removed' : 'Job Saved', 
        isSaved ? 'Job removed from your saved list' : 'Job saved to your list'
      );
    } catch (error) {
      notifications.error('Error', 'Failed to save job');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusColor = (status?: ApplicationStatus) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Interview':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Offer':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isDeadlineSoon = () => {
    const deadline = new Date(job.applicationDeadline);
    const now = new Date();
    const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDeadline <= 3 && daysUntilDeadline >= 0;
  };

  const isDeadlinePassed = () => {
    const deadline = new Date(job.applicationDeadline);
    const now = new Date();
    return deadline.getTime() < now.getTime();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {job.title}
            </h3>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
            <div className="flex items-center space-x-1">
              <BookOpen className="w-4 h-4" />
              <span>{job.department}</span>
            </div>
            {job.courseCode && (
              <Badge variant="secondary" size="sm">
                {job.courseCode}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {applicationStatus && (
            <Badge className={getStatusColor(applicationStatus)}>
              {applicationStatus}
            </Badge>
          )}
          
          <motion.button
            onClick={handleSave}
            disabled={isSaving}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            {isSaved ? (
              <Heart className="w-5 h-5 text-red-500 fill-current" />
            ) : (
              <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Job Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="flex items-center space-x-2 text-sm">
          <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span className="text-gray-900 dark:text-white font-medium">
            ${job.payRate}/hr
          </span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-gray-600 dark:text-gray-400">
            {job.hoursPerWeek}h/week
          </span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span className="text-gray-600 dark:text-gray-400">
            {job.isRemote ? 'Remote' : job.location}
          </span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          <span className={`${isDeadlineSoon() ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
            Due {formatDate(job.applicationDeadline)}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
        {job.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {job.tags.slice(0, 4).map((tag, index) => (
          <Badge key={index} variant="secondary" size="sm">
            {tag}
          </Badge>
        ))}
        {job.tags.length > 4 && (
          <Badge variant="secondary" size="sm">
            +{job.tags.length - 4} more
          </Badge>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
          <span>Posted {formatDate(job.postedDate)}</span>
          {isDeadlineSoon() && !isDeadlinePassed() && (
            <Badge variant="warning" size="sm">
              Deadline Soon!
            </Badge>
          )}
          {isDeadlinePassed() && (
            <Badge variant="secondary" size="sm">
              Deadline Passed
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`mailto:${job.contactEmail}`, '_blank')}
            className="flex items-center space-x-1"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Contact</span>
          </Button>
          
          {!isDeadlinePassed() && (
            <Button
              onClick={() => onApply(job)}
              disabled={applicationStatus === 'Applied'}
              className="flex items-center space-x-1"
            >
              <Users className="w-4 h-4" />
              <span>
                {applicationStatus === 'Applied' ? 'Applied' : 'Apply'}
              </span>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
