import { Profile } from '../../../types';
import { InstagramUser, InstagramMedia, InstagramMediaResponse } from './types';
import { MEDIA_TYPES } from './constants';

export function transformProfile(data: InstagramUser): Profile {
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
    media: data.media?.data.map(transformMedia) || [],
  };
}

export function transformHashtagToProfile(
  tag: string,
  hashtagId: string,
  mediaData: InstagramMediaResponse
): Profile {
  const cleanTag = tag.startsWith('#') ? tag.slice(1) : tag;
  
  return {
    id: hashtagId,
    platform_id: hashtagId,
    platform: 'instagram',
    username: `#${cleanTag}`,
    display_name: `#${cleanTag}`,
    followers_count: mediaData.data.length,
    following_count: 0,
    bio: `Posts tagged with #${cleanTag}`,
    media: mediaData.data.map(post => ({
      ...post,
      media_type: post.media_type || MEDIA_TYPES.IMAGE,
      like_count: post.like_count || 0,
      comments_count: post.comments_count || 0,
      is_reel: false
    })),
  };
}

export function transformMedia(media: InstagramMedia): InstagramMedia {
  return {
    ...media,
    media_type: media.is_reel ? MEDIA_TYPES.REEL : media.media_type,
    like_count: media.like_count || 0,
    comments_count: media.comments_count || 0,
    plays_count: media.plays_count || 0
  };
}