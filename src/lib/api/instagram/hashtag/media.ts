import { APIError } from '../../base';
import { instagramFetch } from '../client';
import { BUSINESS_ACCOUNT_ID, FIELDS, ENDPOINTS } from '../constants';
import type { InstagramMediaResponse } from '../types';

export async function getHashtagMedia(hashtagId: string): Promise<InstagramMediaResponse> {
  try {
    const response = await instagramFetch<InstagramMediaResponse>(
      ENDPOINTS.HASHTAG_MEDIA(hashtagId),
      {
        user_id: BUSINESS_ACCOUNT_ID,
        fields: FIELDS.HASHTAG_MEDIA
      }
    );

    if (!response.data) {
      throw new APIError('No media found for hashtag', 'instagram', 404);
    }

    return response;
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError(
      'Failed to fetch hashtag media',
      'instagram',
      404
    );
  }
}