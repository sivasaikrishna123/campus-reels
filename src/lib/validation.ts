export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export class Validator {
  private rules: Record<string, ValidationRule[]> = {};

  addRule(field: string, rule: ValidationRule) {
    if (!this.rules[field]) {
      this.rules[field] = [];
    }
    this.rules[field].push(rule);
    return this;
  }

  validate(data: Record<string, any>): ValidationResult {
    const errors: Record<string, string> = {};

    for (const [field, rules] of Object.entries(this.rules)) {
      const value = data[field];
      
      for (const rule of rules) {
        const error = this.validateField(value, rule, field);
        if (error) {
          errors[field] = error;
          break; // Stop at first error for this field
        }
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  private validateField(value: any, rule: ValidationRule, field: string): string | null {
    // Required validation
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return `${this.getFieldLabel(field)} is required`;
    }

    // Skip other validations if value is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return null;
    }

    // Min length validation
    if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
      return `${this.getFieldLabel(field)} must be at least ${rule.minLength} characters`;
    }

    // Max length validation
    if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
      return `${this.getFieldLabel(field)} must be no more than ${rule.maxLength} characters`;
    }

    // Pattern validation
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      return `${this.getFieldLabel(field)} format is invalid`;
    }

    // Custom validation
    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  }

  private getFieldLabel(field: string): string {
    const labels: Record<string, string> = {
      title: 'Title',
      caption: 'Caption',
      body: 'Content',
      tags: 'Tags',
      courseId: 'Course',
      username: 'Username',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      question: 'Question',
      search: 'Search'
    };
    return labels[field] || field.charAt(0).toUpperCase() + field.slice(1);
  }
}

// Common validation patterns
export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  username: /^[a-zA-Z0-9_]{3,20}$/,
  hashtag: /^[a-zA-Z0-9_]+$/,
  url: /^https?:\/\/.+/,
  phone: /^\+?[\d\s\-\(\)]+$/
};

// Pre-built validators
export const validators = {
  // Post validation
  post: new Validator()
    .addRule('title', { required: true, minLength: 5, maxLength: 100 })
    .addRule('body', { required: true, minLength: 10, maxLength: 2000 })
    .addRule('tags', { 
      custom: (value: string[]) => {
        if (value.length > 5) return 'Maximum 5 tags allowed';
        if (value.some(tag => !patterns.hashtag.test(tag))) return 'Tags can only contain letters, numbers, and underscores';
        return null;
      }
    }),

  // Reel validation
  reel: new Validator()
    .addRule('caption', { required: true, minLength: 5, maxLength: 200 })
    .addRule('tags', { 
      custom: (value: string[]) => {
        if (value.length > 5) return 'Maximum 5 tags allowed';
        if (value.some(tag => !patterns.hashtag.test(tag))) return 'Tags can only contain letters, numbers, and underscores';
        return null;
      }
    }),

  // User validation
  user: new Validator()
    .addRule('username', { required: true, pattern: patterns.username })
    .addRule('email', { required: true, pattern: patterns.email })
    .addRule('password', { required: true, minLength: 8, maxLength: 50 }),

  // Search validation
  search: new Validator()
    .addRule('search', { minLength: 2, maxLength: 100 }),

  // AI question validation
  question: new Validator()
    .addRule('question', { required: true, minLength: 10, maxLength: 500 }),

  // File validation
  file: new Validator()
    .addRule('file', { 
      custom: (value: File | null) => {
        if (!value) return 'File is required';
        if (value.size > 5 * 1024 * 1024) return 'File size must be less than 5MB';
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(value.type)) return 'Only PDF and Word documents are allowed';
        return null;
      }
    })
};

// File validation
export const fileValidation = {
  image: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  },
  video: {
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
    allowedExtensions: ['.mp4', '.webm', '.mov']
  }
};

export const validateFile = (file: File, type: 'image' | 'video'): string | null => {
  const config = fileValidation[type];
  
  if (file.size > config.maxSize) {
    return `File size must be less than ${Math.round(config.maxSize / (1024 * 1024))}MB`;
  }
  
  if (!config.allowedTypes.includes(file.type)) {
    return `File type not supported. Allowed: ${config.allowedExtensions.join(', ')}`;
  }
  
  return null;
};

