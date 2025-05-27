/*
  # Create profiles for existing users
  
  1. Changes
    - Creates profiles for any existing users that don't have one
    - Ensures data consistency for existing users
*/

DO $$
BEGIN
  INSERT INTO public.profiles (id, email)
  SELECT 
    au.id,
    au.email
  FROM auth.users au
  LEFT JOIN public.profiles p ON p.id = au.id
  WHERE p.id IS NULL;
END $$;