import { Platform, SearchType } from '../types';
import { supabase } from './supabase';
import { searchSocialMedia } from './api';
import { getCurrentUser } from './auth';
import { AuthenticationError } from './auth/errors';

export async function performSearch(query: string, platform: Platform, type: SearchType) {
  try {
    // Get current user
    const user = await getCurrentUser();

    // Create search record
    const { error: searchError } = await supabase
      .from('searches')
      .insert({
        user_id: user.id,
        query,
        platform,
        type
      });

    if (searchError) {
      console.error('Search record creation error:', searchError);
      // Continue with search even if recording fails
    }

    // Perform the actual search
    return searchSocialMedia(query, platform, type);
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error;
    }
    console.error('Search failed:', error);
    throw new Error('Search failed. Please try again.');
  }
}