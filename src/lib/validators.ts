import { z } from 'zod';

// University email validation
export const universityEmailSchema = z.string()
  .email('Please enter a valid email address')
  .refine((email) => {
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return false;
    
    // Allow .edu domains
    if (domain.endsWith('.edu')) return true;
    
    // Allow .ac.* domains (international academic domains)
    if (domain.includes('.ac.')) return true;
    
    return false;
  }, 'Please use your university email address (.edu or .ac.* domain)');

// Password validation
export const passwordSchema = z.string()
  .min(10, 'Password must be at least 10 characters long')
  .refine((password) => {
    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) return false;
    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) return false;
    // Check for at least one number
    if (!/\d/.test(password)) return false;
    // Check for at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false;
    return true;
  }, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');

// Signup form validation
export const signupSchema = z.object({
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .regex(/^[a-zA-Z\s\-'\.]+$/, 'Full name can only contain letters, spaces, hyphens, apostrophes, and periods'),
  
  password: passwordSchema,
  
  confirmPassword: z.string(),
  
  university: z.string()
    .min(1, 'Please select a university'),
  
  graduationMonth: z.number()
    .min(1, 'Invalid graduation month')
    .max(12, 'Invalid graduation month'),
  
  graduationYear: z.number()
    .min(new Date().getFullYear(), 'Graduation year cannot be in the past')
    .max(new Date().getFullYear() + 8, 'Graduation year cannot be more than 8 years in the future'),
  
  universityEmail: universityEmailSchema
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

// University domain validation
export const validateUniversityEmail = (
  email: string, 
  university: { primaryDomain?: string }
): boolean => {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  
  // If university has a primary domain, enforce it
  if (university.primaryDomain) {
    return domain === university.primaryDomain.toLowerCase();
  }
  
  // Otherwise, allow any academic domain
  return domain.endsWith('.edu') || domain.includes('.ac.');
};

// Resend email validation
export const resendEmailSchema = z.object({
  universityEmail: universityEmailSchema
});

// Token validation
export const tokenSchema = z.string()
  .length(64, 'Invalid token format')
  .regex(/^[a-f0-9]+$/, 'Invalid token format');

// Export types
export type SignupFormData = z.infer<typeof signupSchema>;
export type ResendEmailData = z.infer<typeof resendEmailSchema>;
export type TokenData = z.infer<typeof tokenSchema>;
