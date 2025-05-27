/*
  # Fix searches table policies

  1. Changes
    - Drop and recreate searches table with proper structure
    - Add proper RLS policies for authenticated users
    - Grant necessary permissions
*/

-- First drop existing policies and table
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON searches;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON searches;
DROP TABLE IF EXISTS searches;

-- Recreate searches table
CREATE TABLE searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  query text NOT NULL,
  platform text NOT NULL,
  type text NOT NULL CHECK (type IN ('handle', 'hashtag')),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE searches ENABLE ROW LEVEL SECURITY;

-- Grant access to authenticated users
GRANT ALL ON searches TO authenticated;

-- Create policies
CREATE POLICY "Enable read for users"
  ON searches FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for users"
  ON searches FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);