import { InstagramMedia } from './types';
import { instagramFetch } from './client';
import { BUSINESS_ACCOUNT_ID } from './constants';
import { APIError, handleAPIError } from '../base';

export async function getInstagramReels(username: string): Promise<InstagramMedia[]> {
  try {
    const data = await instagramFetch<{
      business_discovery: {
        media: {
          data: InstagramMedia[];
        };
      };
    }>(`/${BUSINESS_ACCOUNT_ID}`, {
      fields: `business_discovery.username(${username}){
        media.with_reels_metadata(true){
          data{
            id,
            caption,
            like_count,
            comments_count,
            media_url,
            media_type,
            timestamp,
            permalink,
            thumbnail_url,
            is_reel,
            plays_count
          }
        }
      }`
    });

    if (!data.business_discovery?.media?.data) {
      return [];
    }

    // Filter to only include reels
    return data.business_discovery.media.data.filter(media => media.is_reel);
  } catch (error) {
    handleAPIError(error, 'instagram');
  }
}