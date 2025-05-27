import type { InstagramMedia } from './media';

export interface InstagramUser {
  id: string;
  username: string;
  website?: string;
  name?: string;
  biography?: string;
  ig_id: string;
  profile_picture_url?: string;
  follows_count: string;
  followers_count: string;
  media_count: number;
  media?: {
    data: InstagramMedia[];
    paging?: {
      cursors: {
        before: string;
        after: string;
      };
    };
  };
}