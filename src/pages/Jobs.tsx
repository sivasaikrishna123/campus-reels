import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Filter, Search, Bookmark, TrendingUp } from 'lucide-react';
import { Job, JobFilters, Application, ApplicationStatus } from '../types';
import { storage } from '../lib/storage';
import { notifications } from '../lib/notifications';
import { JobCard } from '../components/jobs/JobCard';
import { JobFilters as JobFiltersComponent } from '../components/jobs/JobFilters';
import { ApplyFAB } from '../components/jobs/ApplyFAB';
import { ApplyModal } from '../components/jobs/ApplyModal';

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [filters, setFilters] = useState<JobFilters>({
    keyword: '',
    department: '',
    jobType: '',
    status: '',
    sortBy: 'newest',
    sortOrder: 'desc'
  });
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());

  const currentUserId = 'user1'; // In a real app, this would come from auth context

  useEffect(() => {
    // Load jobs and applications
    const jobsData = storage.getJobs();
    const applicationsData = storage.getApplicationsByUser(currentUserId);
    const savedJobsData = storage.get('campus_reels_saved_jobs') as string[] || [];
    
    setJobs(jobsData);
    setApplications(applicationsData);
    setSavedJobs(new Set(savedJobsData));
  }, []);

  // Filter and sort jobs
  const processedJobs = useMemo(() => {
    let result = [...jobs];

    // Apply keyword filter
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      result = result.filter(job => 
        job.title.toLowerCase().includes(keyword) ||
        job.department.toLowerCase().includes(keyword) ||
        job.description.toLowerCase().includes(keyword) ||
        job.tags.some(tag => tag.toLowerCase().includes(keyword))
      );
    }

    // Apply department filter
    if (filters.department) {
      result = result.filter(job => job.department === filters.department);
    }

    // Apply job type filter
    if (filters.jobType) {
      result = result.filter(job => job.jobType === filters.jobType);
    }

    // Apply status filter (based on applications)
    if (filters.status) {
      if (filters.status === 'Saved') {
        result = result.filter(job => savedJobs.has(job.id));
      } else {
        const appliedJobIds = applications
          .filter(app => app.status === filters.status)
          .map(app => app.jobId);
        result = result.filter(job => appliedJobIds.includes(job.id));
      }
    }

    // Sort jobs
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'newest':
          comparison = new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime();
          break;
        case 'deadline':
          comparison = new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime();
          break;
        case 'pay':
          comparison = a.payRate - b.payRate;
          break;
      }

      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [jobs, filters, applications, savedJobs]);

  const handleFiltersChange = (newFilters: JobFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, keyword: query }));
  };

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setIsApplyModalOpen(true);
  };

  const handleSave = (jobId: string) => {
    const newSavedJobs = new Set(savedJobs);
    if (savedJobs.has(jobId)) {
      newSavedJobs.delete(jobId);
    } else {
      newSavedJobs.add(jobId);
    }
    setSavedJobs(newSavedJobs);
    storage.set('campus_reels_saved_jobs', Array.from(newSavedJobs));
  };

  const handleApplicationSubmit = (applicationData: any) => {
    if (!selectedJob) return;

    const application: Application = {
      id: Date.now().toString(),
      jobId: selectedJob.id,
      userId: currentUserId,
      status: 'Applied',
      appliedDate: new Date().toISOString(),
      ...applicationData
    };

    storage.addApplication(application);
    setApplications(prev => [...prev, application]);
    
    notifications.success(
      'Application Submitted', 
      `Your application for ${selectedJob.title} has been submitted successfully!`
    );

    setIsApplyModalOpen(false);
    setSelectedJob(null);
  };

  const getApplicationStatus = (jobId: string): ApplicationStatus | undefined => {
    const application = applications.find(app => app.jobId === jobId);
    return application?.status;
  };

  const getStats = () => {
    const totalJobs = jobs.length;
    const appliedJobs = applications.length;
    const savedJobsCount = savedJobs.size;
    const interviewJobs = applications.filter(app => app.status === 'Interview').length;
    const offerJobs = applications.filter(app => app.status === 'Offer').length;

    return { totalJobs, appliedJobs, savedJobsCount, interviewJobs, offerJobs };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Briefcase className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              TA/Grader Jobs
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Find and apply to teaching assistant, grader, and research positions
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalJobs}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Jobs</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.appliedJobs}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Applied</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.interviewJobs}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Interviews</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.offerJobs}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Offers</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.savedJobsCount}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Saved</div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <JobFiltersComponent
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onSearch={handleSearch}
          />
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {processedJobs.length} job{processedJobs.length !== 1 ? 's' : ''} found
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <TrendingUp className="w-4 h-4" />
              <span>Sorted by {filters.sortBy}</span>
            </div>
          </div>

          {processedJobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No jobs found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your filters or search terms
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {processedJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <JobCard
                    job={job}
                    onApply={handleApply}
                    onSave={handleSave}
                    isSaved={savedJobs.has(job.id)}
                    applicationStatus={getApplicationStatus(job.id)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Floating Action Button */}
      <ApplyFAB onApply={handleApply} />

      {/* Apply Modal */}
      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => {
          setIsApplyModalOpen(false);
          setSelectedJob(null);
        }}
        onSubmit={handleApplicationSubmit}
        job={selectedJob}
      />
    </div>
  );
}
