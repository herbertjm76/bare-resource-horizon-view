-- Add theme column to companies table to persist theme per company
ALTER TABLE companies ADD COLUMN theme TEXT DEFAULT 'default';

-- Update existing companies to have the default theme
UPDATE companies SET theme = 'default' WHERE theme IS NULL;