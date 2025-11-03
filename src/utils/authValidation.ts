import { z } from 'zod';

// Validation schema for signup
export const signupSchema = z.object({
  email: z.string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" })
    .toLowerCase(),
  
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(128, { message: "Password must be less than 128 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  
  confirmPassword: z.string()
    .min(1, { message: "Please confirm your password" }),
  
  firstName: z.string()
    .trim()
    .max(50, { message: "First name must be less than 50 characters" })
    .regex(/^[a-zA-Z\s'-]*$/, { message: "First name can only contain letters, spaces, hyphens and apostrophes" })
    .optional()
    .or(z.literal('')),
  
  lastName: z.string()
    .trim()
    .max(50, { message: "Last name must be less than 50 characters" })
    .regex(/^[a-zA-Z\s'-]*$/, { message: "Last name can only contain letters, spaces, hyphens and apostrophes" })
    .optional()
    .or(z.literal('')),
  
  companyName: z.string()
    .trim()
    .min(1, { message: "Company name is required" })
    .max(100, { message: "Company name must be less than 100 characters" }),
  
  subdomain: z.string()
    .trim()
    .min(3, { message: "Subdomain must be at least 3 characters" })
    .max(50, { message: "Subdomain must be less than 50 characters" })
    .regex(/^[a-z0-9-]+$/, { message: "Subdomain can only contain lowercase letters, numbers and hyphens" })
    .toLowerCase(),
  
  website: z.string()
    .trim()
    .url({ message: "Please enter a valid URL" })
    .max(255, { message: "Website URL must be less than 255 characters" })
    .optional()
    .or(z.literal('')),
  
  address: z.string()
    .trim()
    .max(255, { message: "Address must be less than 255 characters" })
    .optional(),
  
  city: z.string()
    .trim()
    .max(100, { message: "City must be less than 100 characters" })
    .optional(),
  
  country: z.string()
    .trim()
    .max(100, { message: "Country must be less than 100 characters" })
    .optional(),
  
  size: z.string()
    .trim()
    .max(50, { message: "Company size must be less than 50 characters" })
    .optional(),
  
  industry: z.string()
    .trim()
    .max(100, { message: "Industry must be less than 100 characters" })
    .optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Validation schema for join form
export const joinSchema = z.object({
  email: z.string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" })
    .toLowerCase(),
  
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(128, { message: "Password must be less than 128 characters" }),
  
  firstName: z.string()
    .trim()
    .min(1, { message: "First name is required" })
    .max(50, { message: "First name must be less than 50 characters" })
    .regex(/^[a-zA-Z\s'-]+$/, { message: "First name can only contain letters, spaces, hyphens and apostrophes" })
    .optional(),
  
  lastName: z.string()
    .trim()
    .min(1, { message: "Last name is required" })
    .max(50, { message: "Last name must be less than 50 characters" })
    .regex(/^[a-zA-Z\s'-]+$/, { message: "Last name can only contain letters, spaces, hyphens and apostrophes" })
    .optional(),
  
  inviteCode: z.string()
    .trim()
    .min(1, { message: "Invite code is required" })
    .max(100, { message: "Invite code must be less than 100 characters" })
    .optional(),
});

// Validation schema for login
export const loginSchema = z.object({
  email: z.string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" })
    .toLowerCase(),
  
  password: z.string()
    .min(1, { message: "Password is required" })
    .max(128, { message: "Password must be less than 128 characters" }),
});

export type SignupFormData = z.infer<typeof signupSchema>;
export type JoinFormData = z.infer<typeof joinSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
