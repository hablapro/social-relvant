import { searchInstagramProfile, searchInstagramHashtag } from './instagram';
import { searchYouTubeChannel, searchYouTubeHashtag } from './youtube';
import { searchTikTokProfile, searchTikTokHashtag } from './tiktok';
import { Platform, SearchType } from '../../types';

export async function searchSocialMedia(
  query: string,
  platform: Platform,
  type: SearchType
) {
  switch (platform) {
    case 'instagram':
      return type === 'handle'
        ? searchInstagramProfile(query)
        : searchInstagramHashtag(query);
    case 'youtube':
      return type === 'handle'
        ? searchYouTubeChannel(query)
        : searchYouTubeHashtag(query);
    case 'tiktok':
      return type === 'handle'
        ? searchTikTokProfile(query)
        : searchTikTokHashtag(query);
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}