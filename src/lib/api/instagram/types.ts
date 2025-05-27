// Update the types file to include hashtag-specific types
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

// Keep existing interfaces...
export interface InstagramUser {
  id: string;
  username: string;
  website?: string;
  name?: string;
  ig_id: string;
  profile_picture_url?: string;
  biography?: string;
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
  hashtag?: InstagramHashtag;
}

// Keep the rest of the existing types...