import { Advisor } from '../types';

export const demoAdvisors: Advisor[] = [
  {
    id: 'advisor1',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@university.edu',
    department: 'Computer Science',
    timezone: 'America/Los_Angeles',
    isOnline: true,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    bio: 'Specializing in software engineering and career development for CS students.',
    specialties: ['Software Engineering', 'Career Development', 'Internships', 'Graduate School'],
    officeHours: [
      {
        day: 'Monday',
        startTime: '10:00',
        endTime: '12:00',
        location: 'Engineering Building, Room 201',
        isVirtual: false
      },
      {
        day: 'Wednesday',
        startTime: '14:00',
        endTime: '16:00',
        location: 'Virtual (Zoom)',
        isVirtual: true
      },
      {
        day: 'Friday',
        startTime: '09:00',
        endTime: '11:00',
        location: 'Engineering Building, Room 201',
        isVirtual: false
      }
    ]
  },
  {
    id: 'advisor2',
    name: 'Prof. Michael Rodriguez',
    email: 'michael.rodriguez@university.edu',
    department: 'Mathematics',
    timezone: 'America/New_York',
    isOnline: false,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Mathematics professor with expertise in calculus, linear algebra, and statistics.',
    specialties: ['Calculus', 'Linear Algebra', 'Statistics', 'Research Methods'],
    officeHours: [
      {
        day: 'Tuesday',
        startTime: '13:00',
        endTime: '15:00',
        location: 'Math Building, Room 150',
        isVirtual: false
      },
      {
        day: 'Thursday',
        startTime: '10:00',
        endTime: '12:00',
        location: 'Virtual (Zoom)',
        isVirtual: true
      }
    ]
  },
  {
    id: 'advisor3',
    name: 'Dr. Emily Johnson',
    email: 'emily.johnson@university.edu',
    department: 'Biology',
    timezone: 'America/Chicago',
    isOnline: true,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    bio: 'Biology professor specializing in molecular biology and pre-med advising.',
    specialties: ['Molecular Biology', 'Pre-Med', 'Research Opportunities', 'Lab Techniques'],
    officeHours: [
      {
        day: 'Monday',
        startTime: '14:00',
        endTime: '16:00',
        location: 'Science Building, Lab 105',
        isVirtual: false
      },
      {
        day: 'Wednesday',
        startTime: '09:00',
        endTime: '11:00',
        location: 'Virtual (Zoom)',
        isVirtual: true
      },
      {
        day: 'Friday',
        startTime: '13:00',
        endTime: '15:00',
        location: 'Science Building, Lab 105',
        isVirtual: false
      }
    ]
  },
  {
    id: 'advisor4',
    name: 'Prof. David Kim',
    email: 'david.kim@university.edu',
    department: 'Chemistry',
    timezone: 'America/Denver',
    isOnline: false,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'Chemistry professor with expertise in organic chemistry and research opportunities.',
    specialties: ['Organic Chemistry', 'Research', 'Graduate School', 'Industry Careers'],
    officeHours: [
      {
        day: 'Tuesday',
        startTime: '10:00',
        endTime: '12:00',
        location: 'Chemistry Building, Research Lab 3',
        isVirtual: false
      },
      {
        day: 'Thursday',
        startTime: '15:00',
        endTime: '17:00',
        location: 'Virtual (Zoom)',
        isVirtual: true
      }
    ]
  },
  {
    id: 'advisor5',
    name: 'Dr. Lisa Wang',
    email: 'lisa.wang@university.edu',
    department: 'Physics',
    timezone: 'America/Los_Angeles',
    isOnline: true,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    bio: 'Physics professor specializing in quantum mechanics and research opportunities.',
    specialties: ['Quantum Mechanics', 'Research', 'Graduate School', 'Physics Careers'],
    officeHours: [
      {
        day: 'Monday',
        startTime: '11:00',
        endTime: '13:00',
        location: 'Physics Building, Room 301',
        isVirtual: false
      },
      {
        day: 'Wednesday',
        startTime: '14:00',
        endTime: '16:00',
        location: 'Virtual (Zoom)',
        isVirtual: true
      },
      {
        day: 'Friday',
        startTime: '10:00',
        endTime: '12:00',
        location: 'Physics Building, Room 301',
        isVirtual: false
      }
    ]
  },
  {
    id: 'advisor6',
    name: 'Prof. James Thompson',
    email: 'james.thompson@university.edu',
    department: 'Statistics',
    timezone: 'America/New_York',
    isOnline: false,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    bio: 'Statistics professor with expertise in data science and statistical methods.',
    specialties: ['Data Science', 'Statistical Methods', 'R Programming', 'Career Development'],
    officeHours: [
      {
        day: 'Tuesday',
        startTime: '09:00',
        endTime: '11:00',
        location: 'Math Building, Room 150',
        isVirtual: false
      },
      {
        day: 'Thursday',
        startTime: '13:00',
        endTime: '15:00',
        location: 'Virtual (Zoom)',
        isVirtual: true
      }
    ]
  },
  {
    id: 'advisor7',
    name: 'Dr. Maria Garcia',
    email: 'maria.garcia@university.edu',
    department: 'English',
    timezone: 'America/Chicago',
    isOnline: true,
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    bio: 'English professor specializing in academic writing and literature.',
    specialties: ['Academic Writing', 'Literature', 'Graduate School', 'Writing Skills'],
    officeHours: [
      {
        day: 'Monday',
        startTime: '13:00',
        endTime: '15:00',
        location: 'English Building, Room 205',
        isVirtual: false
      },
      {
        day: 'Wednesday',
        startTime: '10:00',
        endTime: '12:00',
        location: 'Virtual (Zoom)',
        isVirtual: true
      },
      {
        day: 'Friday',
        startTime: '14:00',
        endTime: '16:00',
        location: 'English Building, Room 205',
        isVirtual: false
      }
    ]
  },
  {
    id: 'advisor8',
    name: 'Prof. Robert Lee',
    email: 'robert.lee@university.edu',
    department: 'Economics',
    timezone: 'America/Denver',
    isOnline: false,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
    bio: 'Economics professor with expertise in microeconomics and policy analysis.',
    specialties: ['Microeconomics', 'Policy Analysis', 'Research', 'Career Development'],
    officeHours: [
      {
        day: 'Tuesday',
        startTime: '14:00',
        endTime: '16:00',
        location: 'Economics Building, Room 120',
        isVirtual: false
      },
      {
        day: 'Thursday',
        startTime: '11:00',
        endTime: '13:00',
        location: 'Virtual (Zoom)',
        isVirtual: true
      }
    ]
  }
];
