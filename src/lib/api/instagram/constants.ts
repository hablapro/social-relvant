// Instagram API Configuration
export const API_CONSTANTS = {
  BUSINESS_ACCOUNT_ID: '17841446117916279',
  
  ENDPOINTS: {
    HASHTAG_SEARCH: '/ig_hashtag_search',
    HASHTAG_MEDIA: (hashtagId: string) => `/${hashtagId}/recent_media`,
    PROFILE: (userId: string) => `/${userId}`,
    MEDIA: (userId: string) => `/${userId}/media`
  },

  FIELDS: {
    PROFILE: [
      'id',
      'username',
      'biography',
      'followers_count',
      'follows_count',
      'media_count',
      'profile_picture_url',
      'name'
    ].join(','),

    MEDIA: [
      'id',
      'caption',
      'media_type',
      'media_url',
      'permalink',
      'thumbnail_url',
      'timestamp',
      'like_count',
      'comments_count'
    ].join(','),

    HASHTAG_MEDIA: [
      'id',
      'caption',
      'media_type',
      'media_url',
      'permalink',
      'timestamp',
      'like_count',
      'comments_count'
    ].join(',')
  },

  MEDIA_TYPES: {
    IMAGE: 'IMAGE',
    VIDEO: 'VIDEO',
    CAROUSEL_ALBUM: 'CAROUSEL_ALBUM',
    REEL: 'REEL'
  }
} as const;

// Re-export individual constants for convenience
export const { 
  BUSINESS_ACCOUNT_ID,
  ENDPOINTS,
  FIELDS,
  MEDIA_TYPES 
} = API_CONSTANTS;