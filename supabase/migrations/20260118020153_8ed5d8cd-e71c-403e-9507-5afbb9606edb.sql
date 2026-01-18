-- Add end_date column to profiles table for tracking member departure dates
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS end_date date;