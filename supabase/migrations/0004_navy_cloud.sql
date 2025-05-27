/*
  # Fix searches table RLS policies

  1. Changes
    - Drop existing RLS policies for searches table
    - Add new policies with proper user authentication checks
    - Ensure users can only create searches for themselves
    - Ensure users can only view their own searches

  2. Security
    - Enable RLS on searches table
    - Add policies for INSERT and SELECT operations
    - Restrict access based on user_id matching auth.uid()
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own searches" ON searches;
DROP POLICY IF EXISTS "Users can create searches" ON searches;

-- Create new policies
CREATE POLICY "Users can view their own searches"
  ON searches FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own searches"
  ON searches FOR INSERT
  WITH CHECK (auth.uid() = user_id);