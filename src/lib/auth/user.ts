import { supabase } from '../supabase';
import { AuthenticationError, AUTH_ERRORS } from './errors';
import { createProfile } from './profile';

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Auth error:', error);
      throw new AuthenticationError(error.message);
    }
    
    if (!user) {
      throw new AuthenticationError(AUTH_ERRORS.NO_USER);
    }
    
    return user;
  } catch (error) {
    if (error instanceof AuthenticationError) throw error;
    console.error('Get current user failed:', error);
    throw new AuthenticationError(AUTH_ERRORS.NO_USER);
  }
}

export async function ensureUserProfile() {
  try {
    const user = await getCurrentUser();
    
    if (!user.email) {
      throw new AuthenticationError(AUTH_ERRORS.INVALID_CREDENTIALS);
    }
    
    const profile = await createProfile(user.id, user.email);
    return { user, profile };
  } catch (error) {
    if (error instanceof AuthenticationError) throw error;
    console.error('Ensure user profile failed:', error);
    throw new AuthenticationError(AUTH_ERRORS.PROFILE_CREATION_FAILED);
  }
}