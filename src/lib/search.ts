import { Reel, Post, Pointer, User, Course } from '../types';
import { storage } from './storage';

export interface SearchResult {
  type: 'reel' | 'post' | 'pointer' | 'user' | 'course';
  id: string;
  title: string;
  description: string;
  author?: string;
  courseId?: string;
  tags: string[];
  score: number;
  timestamp: number;
}

export interface SearchFilters {
  type?: ('reel' | 'post' | 'pointer' | 'user' | 'course')[];
  courseId?: string;
  dateRange?: {
    start: number;
    end: number;
  };
  tags?: string[];
}

export class SearchEngine {
  private index: Map<string, SearchResult> = new Map();
  private isIndexed = false;

  private buildIndex(): void {
    this.index.clear();

    // Index reels
    const reels = storage.getReels();
    reels.forEach(reel => {
      const user = storage.getUsers().find(u => u.id === reel.userId);
      this.index.set(`reel_${reel.id}`, {
        type: 'reel',
        id: reel.id,
        title: reel.caption,
        description: `Reel by ${user?.name || reel.userId}`,
        author: user?.name || reel.userId,
        courseId: reel.courseId,
        tags: reel.tags,
        score: 0,
        timestamp: reel.createdAt
      });
    });

    // Index posts
    const posts = storage.getPosts();
    posts.forEach(post => {
      const user = storage.getUsers().find(u => u.id === post.userId);
      this.index.set(`post_${post.id}`, {
        type: 'post',
        id: post.id,
        title: post.title,
        description: post.body.substring(0, 100) + (post.body.length > 100 ? '...' : ''),
        author: user?.name || post.userId,
        courseId: post.courseId,
        tags: post.tags,
        score: 0,
        timestamp: post.createdAt
      });
    });

    // Index pointers
    const pointers = storage.getPointers();
    pointers.forEach(pointer => {
      this.index.set(`pointer_${pointer.id}`, {
        type: 'pointer',
        id: pointer.id,
        title: pointer.title,
        description: pointer.body.substring(0, 100) + (pointer.body.length > 100 ? '...' : ''),
        courseId: pointer.courseId,
        tags: pointer.tags,
        score: 0,
        timestamp: pointer.createdAt
      });
    });

    // Index users
    const users = storage.getUsers();
    users.forEach(user => {
      this.index.set(`user_${user.id}`, {
        type: 'user',
        id: user.id,
        title: user.name,
        description: `@${user.username}`,
        tags: user.courses,
        score: 0,
        timestamp: 0
      });
    });

    // Index courses
    const courses = storage.getCourses();
    courses.forEach(course => {
      this.index.set(`course_${course.id}`, {
        type: 'course',
        id: course.id,
        title: course.title,
        description: course.code,
        tags: [course.code],
        score: 0,
        timestamp: 0
      });
    });

    this.isIndexed = true;
  }

  search(query: string, filters?: SearchFilters): SearchResult[] {
    if (!this.isIndexed) {
      this.buildIndex();
    }

    if (!query.trim()) {
      return [];
    }

    const searchTerms = query.toLowerCase().split(/\s+/);
    const results: SearchResult[] = [];

    for (const [key, item] of this.index.entries()) {
      // Apply filters
      if (filters?.type && !filters.type.includes(item.type)) {
        continue;
      }
      
      if (filters?.courseId && item.courseId !== filters.courseId) {
        continue;
      }

      if (filters?.tags && !filters.tags.some(tag => item.tags.includes(tag))) {
        continue;
      }

      if (filters?.dateRange) {
        if (item.timestamp < filters.dateRange.start || item.timestamp > filters.dateRange.end) {
          continue;
        }
      }

      // Calculate relevance score
      let score = 0;
      const searchableText = `${item.title} ${item.description} ${item.tags.join(' ')}`.toLowerCase();

      // Exact matches get highest score
      if (searchableText.includes(query.toLowerCase())) {
        score += 100;
      }

      // Individual term matches
      searchTerms.forEach(term => {
        if (item.title.toLowerCase().includes(term)) {
          score += 50;
        }
        if (item.description.toLowerCase().includes(term)) {
          score += 30;
        }
        if (item.tags.some(tag => tag.toLowerCase().includes(term))) {
          score += 40;
        }
        if (item.author?.toLowerCase().includes(term)) {
          score += 35;
        }
      });

      // Boost recent content
      if (item.timestamp > 0) {
        const daysSinceCreation = (Date.now() - item.timestamp) / (1000 * 60 * 60 * 24);
        score += Math.max(0, 20 - daysSinceCreation);
      }

      if (score > 0) {
        results.push({ ...item, score });
      }
    }

    // Sort by score (highest first)
    return results.sort((a, b) => b.score - a.score);
  }

  getSuggestions(query: string, limit = 5): string[] {
    if (!this.isIndexed) {
      this.buildIndex();
    }

    const suggestions = new Set<string>();
    const queryLower = query.toLowerCase();

    for (const item of this.index.values()) {
      // Add matching tags
      item.tags.forEach(tag => {
        if (tag.toLowerCase().includes(queryLower)) {
          suggestions.add(tag);
        }
      });

      // Add matching course codes
      if (item.courseId && item.courseId.toLowerCase().includes(queryLower)) {
        suggestions.add(item.courseId);
      }

      // Add matching usernames
      if (item.author && item.author.toLowerCase().includes(queryLower)) {
        suggestions.add(item.author);
      }
    }

    return Array.from(suggestions).slice(0, limit);
  }

  getTrendingTags(limit = 10): string[] {
    if (!this.isIndexed) {
      this.buildIndex();
    }

    const tagCounts = new Map<string, number>();

    for (const item of this.index.values()) {
      item.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    }

    return Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([tag]) => tag);
  }
}

export const searchEngine = new SearchEngine();

