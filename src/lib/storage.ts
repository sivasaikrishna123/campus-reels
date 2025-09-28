import { User, Course, Reel, Post, Pointer, ChatMessage, ChatLog, Share, Job, Application, Advisor, SupportTicket, AuthUser, EmailVerificationToken } from '../types';
import { demoUsers } from '../data/users';
import { demoCourses } from '../data/courses';
import { demoReels } from '../data/reels';
import { demoPosts } from '../data/posts';
import { demoPointers } from '../data/pointers';
import { demoJobs } from '../data/jobs';
import { demoAdvisors } from '../data/advisors';

const STORAGE_KEYS = {
  USERS: 'campus_reels_users',
  COURSES: 'campus_reels_courses',
  REELS: 'campus_reels_reels',
  POSTS: 'campus_reels_posts',
  POINTERS: 'campus_reels_pointers',
  CHAT_MESSAGES: 'campus_reels_chat_messages',
  CHAT_LOGS: 'campus_reels_chat_logs',
  SHARES: 'campus_reels_shares',
  JOBS: 'campus_reels_jobs',
  APPLICATIONS: 'campus_reels_applications',
  ADVISORS: 'campus_reels_advisors',
  SUPPORT_TICKETS: 'campus_reels_support_tickets',
  AUTH_USERS: 'campus_reels_auth_users',
  EMAIL_TOKENS: 'campus_reels_email_tokens',
  SEEDED: 'campus_reels_seeded'
};

export const storage = {
  // Generic storage helpers
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },

  remove(key: string): void {
    localStorage.removeItem(key);
  },

  // Specific data getters
  getUsers(): User[] {
    return (this.get(STORAGE_KEYS.USERS) as User[]) || [];
  },

  getCourses(): Course[] {
    return (this.get(STORAGE_KEYS.COURSES) as Course[]) || [];
  },

  getReels(): Reel[] {
    return (this.get(STORAGE_KEYS.REELS) as Reel[]) || [];
  },

  getPosts(): Post[] {
    return (this.get(STORAGE_KEYS.POSTS) as Post[]) || [];
  },

  getPointers(): Pointer[] {
    return (this.get(STORAGE_KEYS.POINTERS) as Pointer[]) || [];
  },

  getChatMessages(): ChatMessage[] {
    return (this.get(STORAGE_KEYS.CHAT_MESSAGES) as ChatMessage[]) || [];
  },

  // Specific data setters
  setUsers(users: User[]): void {
    this.set(STORAGE_KEYS.USERS, users);
  },

  setCourses(courses: Course[]): void {
    this.set(STORAGE_KEYS.COURSES, courses);
  },

  setReels(reels: Reel[]): void {
    this.set(STORAGE_KEYS.REELS, reels);
  },

  setPosts(posts: Post[]): void {
    this.set(STORAGE_KEYS.POSTS, posts);
  },

  setPointers(pointers: Pointer[]): void {
    this.set(STORAGE_KEYS.POINTERS, pointers);
  },

  setChatMessages(messages: ChatMessage[]): void {
    this.set(STORAGE_KEYS.CHAT_MESSAGES, messages);
  },

  // Add new items
  addReel(reel: Reel): void {
    const reels = this.getReels();
    this.setReels([reel, ...reels]);
  },

  addPost(post: Post): void {
    const posts = this.getPosts();
    this.setPosts([post, ...posts]);
  },

  addPointer(pointer: Pointer): void {
    const pointers = this.getPointers();
    this.setPointers([pointer, ...pointers]);
  },

  addChatMessage(message: ChatMessage): void {
    const messages = this.getChatMessages();
    this.setChatMessages([...messages, message]);
  },

  // Chat logs (conversation sessions)
  getChatLogs(): ChatLog[] {
    return (this.get(STORAGE_KEYS.CHAT_LOGS) as ChatLog[]) || [];
  },

  setChatLogs(logs: ChatLog[]): void {
    this.set(STORAGE_KEYS.CHAT_LOGS, logs);
  },

  addChatLog(log: ChatLog): void {
    const logs = this.getChatLogs();
    this.setChatLogs([...logs, log]);
  },

  updateChatLog(id: string, updates: Partial<ChatLog>): void {
    const logs = this.getChatLogs();
    const updatedLogs = logs.map(log => 
      log.id === id ? { ...log, ...updates } : log
    );
    this.setChatLogs(updatedLogs);
  },

  // Shares tracking
  getShares(): Share[] {
    return (this.get(STORAGE_KEYS.SHARES) as Share[]) || [];
  },

  setShares(shares: Share[]): void {
    this.set(STORAGE_KEYS.SHARES, shares);
  },

  addShare(share: Share): void {
    const shares = this.getShares();
    this.setShares([...shares, share]);
  },

  // Update items
  updateReel(id: string, updates: Partial<Reel>): void {
    const reels = this.getReels();
    const updatedReels = reels.map(reel => 
      reel.id === id ? { ...reel, ...updates } : reel
    );
    this.setReels(updatedReels);
  },

  updatePost(id: string, updates: Partial<Post>): void {
    const posts = this.getPosts();
    const updatedPosts = posts.map(post => 
      post.id === id ? { ...post, ...updates } : post
    );
    this.setPosts(updatedPosts);
  },

  updatePointer(id: string, updates: Partial<Pointer>): void {
    const pointers = this.getPointers();
    const updatedPointers = pointers.map(pointer => 
      pointer.id === id ? { ...pointer, ...updates } : pointer
    );
    this.setPointers(updatedPointers);
  },

  // Check if data has been seeded
  isSeeded(): boolean {
    return (this.get(STORAGE_KEYS.SEEDED) as boolean) || false;
  },

  // Seed demo data
  seedDemoData(): void {
    // Always reseed to include new reels
    this.setUsers(demoUsers);
    this.setCourses(demoCourses);
    this.setReels(demoReels);
    this.setPosts(demoPosts);
    this.setPointers(demoPointers);
    this.setJobs(demoJobs);
    this.setAdvisors(demoAdvisors);
    this.set(STORAGE_KEYS.SEEDED, true);

    console.log('Demo data seeded successfully!');
  },


  // Clear all data (for development)
  clearAll(): void {
    const keys = [
      STORAGE_KEYS.USERS,
      STORAGE_KEYS.COURSES,
      STORAGE_KEYS.REELS,
      STORAGE_KEYS.POSTS,
      STORAGE_KEYS.POINTERS,
      STORAGE_KEYS.CHAT_MESSAGES,
      STORAGE_KEYS.CHAT_LOGS,
      STORAGE_KEYS.SHARES,
      STORAGE_KEYS.JOBS,
      STORAGE_KEYS.APPLICATIONS,
      STORAGE_KEYS.ADVISORS,
      STORAGE_KEYS.SUPPORT_TICKETS,
      STORAGE_KEYS.AUTH_USERS,
      STORAGE_KEYS.EMAIL_TOKENS,
      STORAGE_KEYS.SEEDED
    ];
    keys.forEach(key => {
      this.remove(key);
    });
  },

  // Job management
  getJobs(): Job[] {
    return (this.get(STORAGE_KEYS.JOBS) as Job[]) || [];
  },

  setJobs(jobs: Job[]): void {
    this.set(STORAGE_KEYS.JOBS, jobs);
  },

  addJob(job: Job): void {
    const jobs = this.getJobs();
    this.setJobs([...jobs, job]);
  },

  updateJob(id: string, updates: Partial<Job>): void {
    const jobs = this.getJobs();
    const updatedJobs = jobs.map(job => 
      job.id === id ? { ...job, ...updates } : job
    );
    this.setJobs(updatedJobs);
  },

  deleteJob(id: string): void {
    const jobs = this.getJobs();
    this.setJobs(jobs.filter(job => job.id !== id));
  },

  // Application management
  getApplications(): Application[] {
    return (this.get(STORAGE_KEYS.APPLICATIONS) as Application[]) || [];
  },

  setApplications(applications: Application[]): void {
    this.set(STORAGE_KEYS.APPLICATIONS, applications);
  },

  addApplication(application: Application): void {
    const applications = this.getApplications();
    this.setApplications([...applications, application]);
  },

  updateApplication(id: string, updates: Partial<Application>): void {
    const applications = this.getApplications();
    const updatedApplications = applications.map(app => 
      app.id === id ? { ...app, ...updates } : app
    );
    this.setApplications(updatedApplications);
  },

  deleteApplication(id: string): void {
    const applications = this.getApplications();
    this.setApplications(applications.filter(app => app.id !== id));
  },

  getApplicationsByUser(userId: string): Application[] {
    const applications = this.getApplications();
    return applications.filter(app => app.userId === userId);
  },

  getApplicationByJob(jobId: string, userId: string): Application | null {
    const applications = this.getApplications();
    return applications.find(app => app.jobId === jobId && app.userId === userId) || null;
  },

  // Advisor management
  getAdvisors(): Advisor[] {
    return (this.get(STORAGE_KEYS.ADVISORS) as Advisor[]) || [];
  },

  setAdvisors(advisors: Advisor[]): void {
    this.set(STORAGE_KEYS.ADVISORS, advisors);
  },

  updateAdvisor(id: string, updates: Partial<Advisor>): void {
    const advisors = this.getAdvisors();
    const updatedAdvisors = advisors.map(advisor => 
      advisor.id === id ? { ...advisor, ...updates } : advisor
    );
    this.setAdvisors(updatedAdvisors);
  },

  // Support ticket management
  getSupportTickets(): SupportTicket[] {
    return (this.get(STORAGE_KEYS.SUPPORT_TICKETS) as SupportTicket[]) || [];
  },

  setSupportTickets(tickets: SupportTicket[]): void {
    this.set(STORAGE_KEYS.SUPPORT_TICKETS, tickets);
  },

  addSupportTicket(ticket: SupportTicket): void {
    const tickets = this.getSupportTickets();
    this.setSupportTickets([...tickets, ticket]);
  },

  updateSupportTicket(id: string, updates: Partial<SupportTicket>): void {
    const tickets = this.getSupportTickets();
    const updatedTickets = tickets.map(ticket => 
      ticket.id === id ? { ...ticket, ...updates } : ticket
    );
    this.setSupportTickets(updatedTickets);
  },

  // Authentication user management
  getAuthUsers(): AuthUser[] {
    return (this.get(STORAGE_KEYS.AUTH_USERS) as AuthUser[]) || [];
  },

  setAuthUsers(users: AuthUser[]): void {
    this.set(STORAGE_KEYS.AUTH_USERS, users);
  },

  addAuthUser(user: AuthUser): void {
    const users = this.getAuthUsers();
    this.setAuthUsers([...users, user]);
  },

  updateAuthUser(id: string, updates: Partial<AuthUser>): void {
    const users = this.getAuthUsers();
    const updatedUsers = users.map(user => 
      user.id === id ? { ...user, ...updates } : user
    );
    this.setAuthUsers(updatedUsers);
  },

  getAuthUserByEmail(email: string): AuthUser | null {
    const users = this.getAuthUsers();
    return users.find(user => user.universityEmail === email) || null;
  },

  // Email verification token management
  getEmailTokens(): EmailVerificationToken[] {
    return (this.get(STORAGE_KEYS.EMAIL_TOKENS) as EmailVerificationToken[]) || [];
  },

  setEmailTokens(tokens: EmailVerificationToken[]): void {
    this.set(STORAGE_KEYS.EMAIL_TOKENS, tokens);
  },

  addEmailToken(token: EmailVerificationToken): void {
    const tokens = this.getEmailTokens();
    this.setEmailTokens([...tokens, token]);
  },

  getEmailTokenByToken(token: string): EmailVerificationToken | null {
    const tokens = this.getEmailTokens();
    return tokens.find(t => t.token === token) || null;
  },

  deleteEmailToken(id: string): void {
    const tokens = this.getEmailTokens();
    this.setEmailTokens(tokens.filter(token => token.id !== id));
  }
};

// Auto-seed on first load
export const hydrateDemo = () => {
  storage.seedDemoData();
};
