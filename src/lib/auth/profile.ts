import { supabase } from '../supabase';
import { AuthenticationError, AUTH_ERRORS } from './errors';

export async function createProfile(userId: string, email: string) {
  if (!userId || !email) {
    throw new AuthenticationError(AUTH_ERRORS.INVALID_CREDENTIALS);
  }

  try {
    // First check if profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('id', userId)
      .maybeSingle();

    // If there's an error other than "not found", throw it
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Profile fetch error:', fetchError);
      throw new AuthenticationError(AUTH_ERRORS.PROFILE_CREATION_FAILED);
    }

    // If profile exists, return it
    if (existingProfile) {
      return existingProfile;
    }

    // Create new profile
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert([
        { 
          id: userId, 
          email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Profile creation error:', insertError);
      throw new AuthenticationError(AUTH_ERRORS.PROFILE_CREATION_FAILED);
    }

    return newProfile;
  } catch (error) {
    if (error instanceof AuthenticationError) throw error;
    console.error('Profile creation failed:', error);
    throw new AuthenticationError(AUTH_ERRORS.PROFILE_CREATION_FAILED);
  }
}