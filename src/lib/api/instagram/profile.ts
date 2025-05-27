import { Profile } from '../../../types';
import { InstagramUser } from './types';
import { instagramFetch } from './client';
import { APIError } from '../base';
import { BUSINESS_ACCOUNT_ID, FIELDS } from './constants';
import { transformProfile } from './transformers';

export async function searchInstagramProfile(username: string): Promise<Profile> {
  try {
    // Clean up username (remove @ if present)
    const cleanUsername = username.startsWith('@') ? username.slice(1) : username;

    // Use business discovery endpoint with full fields
    const response = await instagramFetch<{
      business_discovery: InstagramUser;
    }>(`/${BUSINESS_ACCOUNT_ID}`, {
      fields: `business_discovery.username(${cleanUsername}){
        id,
        username,
        name,
        biography,
        profile_picture_url,
        followers_count,
        follows_count,
        media.limit(50){${FIELDS.MEDIA}}
      }`
    });

    if (!response.business_discovery) {
      throw new APIError('Profile not found or not accessible', 'instagram', 404);
    }

    return transformProfile(response.business_discovery);
  } catch (error) {
    if (error instanceof APIError) {
      if (error.statusCode === 400) {
        throw new APIError('Profile not found or not accessible', 'instagram', 404);
      }
      throw error;
    }
    throw new APIError('Failed to fetch profile', 'instagram', 500);
  }
}