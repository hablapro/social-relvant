/*
  # Initial Schema Setup for Social Relvant

  1. New Tables
    - `profiles`
      - Stores user profile information
      - Contains authentication and preferences
    - `searches`
      - Stores search history and parameters
    - `social_profiles`
      - Stores fetched social media profile data
    - `social_posts`
      - Stores fetched social media post data
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create searches table
CREATE TABLE IF NOT EXISTS searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  query text NOT NULL,
  platform text NOT NULL,
  type text NOT NULL CHECK (type IN ('handle', 'hashtag')),
  created_at timestamptz DEFAULT now()
);

-- Create social_profiles table
CREATE TABLE IF NOT EXISTS social_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform_id text NOT NULL,
  platform text NOT NULL,
  username text NOT NULL,
  display_name text,
  followers_count integer DEFAULT 0,
  following_count integer DEFAULT 0,
  bio text,
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create social_posts table
CREATE TABLE IF NOT EXISTS social_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform_post_id text NOT NULL,
  platform text NOT NULL,
  profile_id uuid REFERENCES social_profiles(id) ON DELETE CASCADE,
  content text,
  engagement_count integer DEFAULT 0,
  posted_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can view their own searches"
  ON searches FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create searches"
  ON searches FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view social profiles"
  ON social_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view social posts"
  ON social_posts FOR SELECT
  TO authenticated
  USING (true);