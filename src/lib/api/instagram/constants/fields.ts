// Instagram API Field Sets
export const FIELDS = {
  PROFILE: [
    'id',
    'username',
    'name',
    'biography',
    'followers_count',
    'follows_count',
    'media_count',
    'profile_picture_url'
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
    'comments_count',
    'is_reel',
    'plays_count'
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
} as const;