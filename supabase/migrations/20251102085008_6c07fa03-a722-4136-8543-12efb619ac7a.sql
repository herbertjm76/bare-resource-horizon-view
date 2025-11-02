-- Add card_order column to user_rundown_preferences to store the order of all cards
ALTER TABLE user_rundown_preferences 
ADD COLUMN card_order jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN user_rundown_preferences.card_order IS 'Array of card IDs in display order, e.g., ["weekInfo", "holidays", "annualLeave", "custom_xyz", "otherLeave", "notes", "available"]';