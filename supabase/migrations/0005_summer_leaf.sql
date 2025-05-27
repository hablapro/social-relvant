/*
  # Fix searches table permissions and RLS policies

  1. Changes
    - Drop and recreate searches table with proper constraints
    - Add proper RLS policies with explicit grants
    - Ensure authenticated users can create and view their searches

  2. Security
    - Enable RLS
    - Grant proper permissions to authenticated users
    - Add explicit policies for all operations
*/

-- Recreate searches table with proper permissions
DROP TABLE IF EXISTS searches;

CREATE TABLE searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  query text NOT NULL,
  platform text NOT NULL,
  type text NOT NULL CHECK (type IN ('handle', 'hashtag')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE searches ENABLE ROW LEVEL SECURITY;

-- Grant access to authenticated users
GRANT SELECT, INSERT ON searches TO authenticated;

-- Create explicit policies
CREATE POLICY "Enable read access for authenticated users"
  ON searches FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable insert access for authenticated users"
  ON searches FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);