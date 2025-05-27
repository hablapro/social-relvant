/*
  # Add profile creation trigger
  
  1. Changes
    - Add trigger to automatically create profile when user signs up
    - Ensures profile exists before searches can be created
  
  2. Security
    - Maintains existing RLS policies
    - Profile creation handled automatically by database
*/

-- Create trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();