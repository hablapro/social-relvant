export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      searches: {
        Row: {
          id: string;
          user_id: string;
          query: string;
          platform: string;
          type: 'handle' | 'hashtag';
          created_at: string;
        };
      };
      social_profiles: {
        Row: {
          id: string;
          platform_id: string;
          platform: string;
          username: string;
          display_name: string | null;
          followers_count: number;
          following_count: number;
          bio: string | null;
          last_updated: string;
          created_at: string;
        };
      };
      social_posts: {
        Row: {
          id: string;
          platform_post_id: string;
          platform: string;
          profile_id: string;
          content: string | null;
          engagement_count: number;
          posted_at: string | null;
          created_at: string;
        };
      };
    };
  };
}