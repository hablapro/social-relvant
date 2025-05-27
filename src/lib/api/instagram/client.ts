import { API_CONFIG } from '../../../config/api';
import { APIError } from '../base';
import { INSTAGRAM_ERROR_MESSAGES } from './errors';

export async function instagramFetch<T>(
  endpoint: string,
  params: Record<string, string> = {}
): Promise<T> {
  if (!API_CONFIG.instagram.accessToken) {
    throw new APIError('Instagram access token is not configured', 'instagram', 401);
  }

  try {
    // Use the me/accounts endpoint first to get pages
    const accountsUrl = new URL(`${API_CONFIG.instagram.baseUrl}/${API_CONFIG.instagram.apiVersion}/me/accounts`);
    accountsUrl.searchParams.append('access_token', API_CONFIG.instagram.accessToken);
    
    const accountsResponse = await fetch(accountsUrl.toString());
    const accountsData = await accountsResponse.json();

    if (accountsData.error) {
      throw new APIError(accountsData.error.message, 'instagram', accountsData.error.code);
    }

    if (!accountsData.data?.[0]?.id) {
      throw new APIError('No Facebook Page found. Please ensure you have a Facebook Page connected to your Instagram account.', 'instagram', 404);
    }

    // Now make the actual API request using the page access token
    const url = new URL(`${API_CONFIG.instagram.baseUrl}/${API_CONFIG.instagram.apiVersion}${endpoint}`);
    url.searchParams.append('access_token', API_CONFIG.instagram.accessToken);
    
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.append(key, value);
    }

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.error) {
      const error = data.error;
      
      switch (error.code) {
        case 190:
          throw new APIError(INSTAGRAM_ERROR_MESSAGES.TOKEN_EXPIRED, 'instagram', 401);
        case 24:
          throw new APIError(INSTAGRAM_ERROR_MESSAGES.RATE_LIMIT, 'instagram', 429);
        case 100:
          throw new APIError(INSTAGRAM_ERROR_MESSAGES.PROFILE_NOT_FOUND, 'instagram', 404);
        default:
          throw new APIError(error.message || INSTAGRAM_ERROR_MESSAGES.GENERIC_ERROR, 'instagram', response.status);
      }
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError(
      error instanceof Error ? error.message : INSTAGRAM_ERROR_MESSAGES.GENERIC_ERROR,
      'instagram'
    );
  }
}