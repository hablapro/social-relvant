import { Profile } from '../../../../types';
import { APIError } from '../../base';
import { API_CONFIG } from '../../../../config/api';
import { INSTAGRAM_ERROR_MESSAGES } from '../errors';

export async function searchInstagramProfile(username: string): Promise<Profile> {
  try {
    const cleanUsername = username.startsWith('@') ? username.slice(1) : username;
    const accessToken = API_CONFIG.instagram.accessToken;

    if (!accessToken) {
      throw new APIError(INSTAGRAM_ERROR_MESSAGES.TOKEN_INVALID, 'instagram', 401);
    }

    // Direct profile lookup using Graph API
    const url = new URL(`${API_CONFIG.instagram.baseUrl}/${API_CONFIG.instagram.apiVersion}/me`);
    url.searchParams.append('access_token', accessToken);
    url.searchParams.append('fields', 'id,username,name,profile_picture_url,followers_count,follows_count,biography');

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.error) {
      throw new APIError(
        data.error.message || INSTAGRAM_ERROR_MESSAGES.GENERIC_ERROR,
        'instagram',
        data.error.code
      );
    }

    return {
      id: data.id,
      platform_id: data.id,
      platform: 'instagram',
      username: data.username,
      display_name: data.name || data.username,
      followers_count: parseInt(data.followers_count) || 0,
      following_count: parseInt(data.follows_count) || 0,
      bio: data.biography || '',
      profile_picture_url: data.profile_picture_url,
      media: [] // Simplified version without media
    };
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError(INSTAGRAM_ERROR_MESSAGES.GENERIC_ERROR, 'instagram', 500);
  }
}