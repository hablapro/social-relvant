import { Profile } from '../../../../types';
import { APIError } from '../../base';
import { BUSINESS_ACCOUNT_ID, FIELDS } from '../constants';
import { instagramFetch } from '../client';
import { transformHashtagToProfile } from '../transformers';

export async function searchInstagramHashtag(tag: string): Promise<Profile> {
  try {
    // Clean up hashtag (remove # if present)
    const cleanTag = tag.startsWith('#') ? tag.slice(1) : tag;

    // Get hashtag ID
    const hashtagSearch = await instagramFetch<{
      data: Array<{ id: string, name: string }>
    }>('/ig_hashtag_search', {
      q: cleanTag,
      user_id: BUSINESS_ACCOUNT_ID
    });

    if (!hashtagSearch.data?.length) {
      throw new APIError(`Hashtag #${cleanTag} not found`, 'instagram', 404);
    }

    const hashtagId = hashtagSearch.data[0].id;

    // Get recent media for hashtag
    const mediaData = await instagramFetch<{
      data: Array<{
        id: string;
        caption?: string;
        media_type: string;
        media_url: string;
        permalink: string;
        timestamp: string;
        like_count: number;
        comments_count: number;
      }>;
    }>(`/${hashtagId}/recent_media`, {
      user_id: BUSINESS_ACCOUNT_ID,
      fields: FIELDS.HASHTAG_MEDIA
    });

    if (!mediaData.data) {
      throw new APIError(`No media found for hashtag #${cleanTag}`, 'instagram', 404);
    }

    // Transform to profile format
    return transformHashtagToProfile(cleanTag, hashtagId, {
      data: mediaData.data.map(post => ({
        ...post,
        media_type: post.media_type || 'IMAGE',
        like_count: post.like_count || 0,
        comments_count: post.comments_count || 0
      }))
    });
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(
      `Failed to search hashtag #${tag}`,
      'instagram',
      500
    );
  }
}