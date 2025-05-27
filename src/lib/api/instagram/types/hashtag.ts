import type { InstagramMediaResponse } from './media';

export interface InstagramHashtag {
  id: string;
  name: string;
  media_count: number;
  media: InstagramMediaResponse;
}

export interface InstagramHashtagResponse {
  business_discovery: {
    hashtag: InstagramHashtag;
  };
}