-- Create user_view_presets table for saved filter combinations
CREATE TABLE user_view_presets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  view_type text NOT NULL CHECK (view_type IN ('resource_scheduling', 'resource_planning', 'by_project', 'by_person')),
  filters jsonb NOT NULL DEFAULT '{}',
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, company_id, name, view_type)
);

-- RLS policies for user_view_presets
ALTER TABLE user_view_presets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own presets"
  ON user_view_presets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own presets"
  ON user_view_presets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own presets"
  ON user_view_presets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own presets"
  ON user_view_presets FOR DELETE
  USING (auth.uid() = user_id);

-- Create user_pinned_items table for pinned projects/people
CREATE TABLE user_pinned_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  item_type text NOT NULL CHECK (item_type IN ('project', 'person')),
  item_id uuid NOT NULL,
  view_context text NOT NULL,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, company_id, item_type, item_id, view_context)
);

-- RLS policies for user_pinned_items
ALTER TABLE user_pinned_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own pins"
  ON user_pinned_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own pins"
  ON user_pinned_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pins"
  ON user_pinned_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pins"
  ON user_pinned_items FOR DELETE
  USING (auth.uid() = user_id);

-- Index for fast lookups
CREATE INDEX idx_user_pinned_items_lookup 
  ON user_pinned_items(user_id, company_id, view_context);

CREATE INDEX idx_user_view_presets_lookup
  ON user_view_presets(user_id, company_id, view_type);