/*
  # Update favorites table and policies

  1. Changes
    - Add safety checks for existing objects
    - Ensure clean policy creation
    - Set up proper permissions

  2. Security
    - Enable RLS
    - Add policies for authenticated users to:
      - View their own favorites
      - Add new favorites
      - Remove their favorites
*/

-- First check if table exists and create if needed
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'favorites'
  ) THEN
    CREATE TABLE favorites (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
      platform text NOT NULL CHECK (platform IN ('instagram', 'youtube')),
      content_id text NOT NULL,
      title text NOT NULL,
      thumbnail text,
      created_at timestamptz DEFAULT now(),
      UNIQUE(user_id, platform, content_id)
    );

    -- Enable RLS
    ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

    -- Create policies
    CREATE POLICY "Users can view their own favorites"
      ON favorites FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can add their own favorites"
      ON favorites FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can remove their own favorites"
      ON favorites FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);

    -- Grant necessary permissions
    GRANT ALL ON favorites TO authenticated;
  END IF;
END $$;