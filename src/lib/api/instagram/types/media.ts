import { MediaType } from '../constants/media';

export interface InstagramMedia {
  id: string;
  caption?: string;
  like_count: number;
  comments_count: number;
  media_url: string;
  media_type: MediaType;
  timestamp: string;
  permalink?: string;
  thumbnail_url?: string;
  is_reel?: boolean;
  plays_count?: number;
  children?: {
    data: Array<{
      id: string;
      media_type: MediaType;
      media_url: string;
    }>;
  };
}

export interface InstagramMediaResponse {
  data: InstagramMedia[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
  };
}