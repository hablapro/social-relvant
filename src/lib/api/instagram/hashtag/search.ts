import { APIError } from '../../base';
import { instagramFetch } from '../client';
import { BUSINESS_ACCOUNT_ID, ENDPOINTS } from '../constants';

export async function getHashtagId(tag: string): Promise<string> {
  const cleanTag = tag.startsWith('#') ? tag.slice(1) : tag;
  
  try {
    const response = await instagramFetch<{
      data: Array<{ id: string }>;
    }>(ENDPOINTS.HASHTAG_SEARCH, {
      user_id: BUSINESS_ACCOUNT_ID,
      q: cleanTag
    });

    if (!response.data?.[0]?.id) {
      throw new APIError(`Hashtag #${cleanTag} not found`, 'instagram', 404);
    }

    return response.data[0].id;
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError(
      `Failed to search hashtag #${cleanTag}`,
      'instagram',
      404
    );
  }
}