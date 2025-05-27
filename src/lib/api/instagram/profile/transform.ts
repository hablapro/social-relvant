import { Profile } from '../../../../types';
import { InstagramUser } from '../types';

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
    media: data.media?.data || [],
  };
}