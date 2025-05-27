export type Platform = 'instagram' | 'youtube' | 'tiktok';
export type SearchType = 'handle' | 'hashtag';
export type MediaType = 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM' | 'REEL';

export interface YouTubeVideo {
  id: string;
  thumbnail: string;
  title: string;
  description: string;
  publishedAt: string;
  link: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

export interface Profile {
  id: string;
  platform_id: string;
  platform: Platform;
  username: string;
  display_name?: string;
  followers_count: number;
  following_count: number;
  bio?: string;
  profile_picture_url?: string;
  media?: any[] | YouTubeVideo[];
}

export interface Post {
  id: string;
  platform_post_id: string;
  platform: Platform;
  profile_id: string;
  content?: string;
  engagement_count: number;
  posted_at: string;
  media_url?: string;
  media_type?: MediaType;
}