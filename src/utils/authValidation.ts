/**
 * @fileoverview Authentication form validation schemas
 * 
 * This module provides Zod validation schemas for authentication-related forms
 * including signup, login, and team member join flows. All schemas include
 * comprehensive validation rules for security and data integrity.
 * 
 * @module utils/authValidation
 * 
 * @example
 * ```ts
 * import { signupSchema, type SignupFormData } from '@/utils/authValidation';
 * 
 * // Validate form data
 * const result = signupSchema.safeParse(formData);
 * if (!result.success) {
 *   console.error(result.error.flatten());
 * }
 * 
 * // Use with react-hook-form
 * const form = useForm<SignupFormData>({
 *   resolver: zodResolver(signupSchema),
 * });
 * ```
 */

import { z } from 'zod';

/**
 * Validation schema for new user registration
 * 
 * Password requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * 
 * Also validates:
 * - Company name (required)
 * - Subdomain (lowercase alphanumeric + hyphens)
 * - Password confirmation match
 */
export const signupSchema = z.object({
  /** User's email address (required, valid format, lowercase) */
  email: z.string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" })
    .toLowerCase(),
  
  /** User's password (8+ chars, mixed case, numbers) */
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(128, { message: "Password must be less than 128 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  
  /** Password confirmation (must match password) */
  confirmPassword: z.string()
    .min(1, { message: "Please confirm your password" }),
  
  /** User's first name (optional, letters/spaces/hyphens only) */
  firstName: z.string()
    .trim()
    .max(50, { message: "First name must be less than 50 characters" })
    .regex(/^[a-zA-Z\s'-]*$/, { message: "First name can only contain letters, spaces, hyphens and apostrophes" })
    .optional()
    .or(z.literal('')),
  
  /** User's last name (optional, letters/spaces/hyphens only) */
  lastName: z.string()
    .trim()
    .max(50, { message: "Last name must be less than 50 characters" })
    .regex(/^[a-zA-Z\s'-]*$/, { message: "Last name can only contain letters, spaces, hyphens and apostrophes" })
    .optional()
    .or(z.literal('')),
  
  /** Company name (required) */
  companyName: z.string()
    .trim()
    .min(1, { message: "Company name is required" })
    .max(100, { message: "Company name must be less than 100 characters" }),
  
  /** Company subdomain (lowercase, alphanumeric + hyphens, 3-50 chars) */
  subdomain: z.string()
    .trim()
    .min(3, { message: "Subdomain must be at least 3 characters" })
    .max(50, { message: "Subdomain must be less than 50 characters" })
    .regex(/^[a-z0-9-]+$/, { message: "Subdomain can only contain lowercase letters, numbers and hyphens" })
    .toLowerCase(),
  
  /** Company website URL (optional, valid URL format) */
  website: z.string()
    .trim()
    .url({ message: "Please enter a valid URL" })
    .max(255, { message: "Website URL must be less than 255 characters" })
    .optional()
    .or(z.literal('')),
  
  /** Company address (optional) */
  address: z.string()
    .trim()
    .max(255, { message: "Address must be less than 255 characters" })
    .optional(),
  
  /** Company city (optional) */
  city: z.string()
    .trim()
    .max(100, { message: "City must be less than 100 characters" })
    .optional(),
  
  /** Company country (optional) */
  country: z.string()
    .trim()
    .max(100, { message: "Country must be less than 100 characters" })
    .optional(),
  
  /** Company size (optional, e.g., "1-10", "11-50") */
  size: z.string()
    .trim()
    .max(50, { message: "Company size must be less than 50 characters" })
    .optional(),
  
  /** Company industry (optional) */
  industry: z.string()
    .trim()
    .max(100, { message: "Industry must be less than 100 characters" })
    .optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

/**
 * Validation schema for team member join form
 * 
 * Used when a new team member joins via invite link.
 * Password requirements are less strict than signup (no complexity rules).
 */
export const joinSchema = z.object({
  /** User's email address (required, valid format) */
  email: z.string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" })
    .toLowerCase(),
  
  /** User's password (8+ characters) */
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(128, { message: "Password must be less than 128 characters" }),
  
  /** User's first name (optional but validated if provided) */
  firstName: z.string()
    .trim()
    .min(1, { message: "First name is required" })
    .max(50, { message: "First name must be less than 50 characters" })
    .regex(/^[a-zA-Z\s'-]+$/, { message: "First name can only contain letters, spaces, hyphens and apostrophes" })
    .optional(),
  
  /** User's last name (optional but validated if provided) */
  lastName: z.string()
    .trim()
    .min(1, { message: "Last name is required" })
    .max(50, { message: "Last name must be less than 50 characters" })
    .regex(/^[a-zA-Z\s'-]+$/, { message: "Last name can only contain letters, spaces, hyphens and apostrophes" })
    .optional(),
  
  /** Invite code from join link (optional) */
  inviteCode: z.string()
    .trim()
    .min(1, { message: "Invite code is required" })
    .max(100, { message: "Invite code must be less than 100 characters" })
    .optional(),
});

/**
 * Validation schema for user login
 * 
 * Simple email/password validation for existing users.
 */
export const loginSchema = z.object({
  /** User's email address (required, valid format) */
  email: z.string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" })
    .toLowerCase(),
  
  /** User's password (required, no complexity validation) */
  password: z.string()
    .min(1, { message: "Password is required" })
    .max(128, { message: "Password must be less than 128 characters" }),
});

/** Type for validated signup form data */
export type SignupFormData = z.infer<typeof signupSchema>;

/** Type for validated join form data */
export type JoinFormData = z.infer<typeof joinSchema>;

/** Type for validated login form data */
export type LoginFormData = z.infer<typeof loginSchema>;
