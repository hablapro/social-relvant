// Instagram API Endpoints
export const ENDPOINTS = {
  HASHTAG_SEARCH: '/ig_hashtag_search',
  HASHTAG_MEDIA: (hashtagId: string) => `/${hashtagId}/recent_media`,
  PROFILE: (userId: string) => `/${userId}`,
  MEDIA: (userId: string) => `/${userId}/media`
} as const;