import { Profile } from '../../../types';
import { InstagramMediaResponse } from './types';
import { instagramFetch } from './client';
import { APIError } from '../base';
import { BUSINESS_ACCOUNT_ID, ENDPOINTS, FIELDS } from './constants';
import { transformHashtagToProfile } from './transformers';

export async function searchInstagramHashtag(tag: string): Promise<Profile> {
  try {
    // Remove # if present at the start of the tag
    const cleanTag = tag.startsWith('#') ? tag.slice(1) : tag;

    // First get hashtag ID
    const hashtagSearch = await instagramFetch<{
      data: Array<{ id: string }>
    }>(ENDPOINTS.HASHTAG_SEARCH, {
      user_id: BUSINESS_ACCOUNT_ID,
      q: cleanTag
    });

    if (!hashtagSearch.data?.length) {
      throw new APIError(`Hashtag #${cleanTag} not found`, 'instagram', 404);
    }

    const hashtagId = hashtagSearch.data[0].id;

    // Get hashtag media
    const mediaData = await instagramFetch<InstagramMediaResponse>(
      ENDPOINTS.HASHTAG_MEDIA(hashtagId),
      {
        user_id: BUSINESS_ACCOUNT_ID,
        fields: FIELDS.HASHTAG_MEDIA
      }
    );

    if (!mediaData.data) {
      throw new APIError('No media found for hashtag', 'instagram', 404);
    }

    // Transform to profile format
    return transformHashtagToProfile(cleanTag, hashtagId, mediaData);
  } catch (error) {
    if (error instanceof APIError) {
      if (error.statusCode === 404) {
        throw new APIError(`Hashtag #${tag} not found`, 'instagram', 404);
      }
      throw error;
    }
    throw new APIError(
      `Failed to search hashtag #${tag}`,
      'instagram',
      500
    );
  }
}