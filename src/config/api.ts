export const API_CONFIG = {
  instagram: {
    accessToken: import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN,
    apiVersion: 'v18.0', // Updated to latest stable version
    baseUrl: 'https://graph.facebook.com',
    fields: {
      profile: [
        'id',
        'username',
        'name',
        'profile_picture_url',
        'followers_count',
        'follows_count',
        'media_count',
        'biography'
      ].join(','),
      media: [
        'id',
        'caption',
        'media_type',
        'media_url',
        'permalink',
        'thumbnail_url',
        'timestamp',
        'like_count',
        'comments_count'
      ].join(',')
    }
  },
  youtube: {
    apiKey: import.meta.env.VITE_YOUTUBE_API_KEY,
    baseUrl: 'https://www.googleapis.com/youtube/v3',
  },
  tiktok: {
    clientKey: import.meta.env.VITE_TIKTOK_CLIENT_KEY,
    clientSecret: import.meta.env.VITE_TIKTOK_CLIENT_SECRET,
    baseUrl: 'https://open.tiktokapis.com/v2',
  },
};