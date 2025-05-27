export const INSTAGRAM_ERROR_MESSAGES = {
  BUSINESS_REQUIRED: 'This Instagram feature requires a Business or Creator account with proper permissions.',
  TOKEN_EXPIRED: 'Instagram authentication expired. Please reconnect your account.',
  RATE_LIMIT: 'Instagram API rate limit reached. Please try again later.',
  PROFILE_NOT_FOUND: 'Instagram profile not found or is not a Business account.',
  TOKEN_INVALID: 'Invalid Instagram access token or insufficient permissions.',
  GENERIC_ERROR: 'An error occurred while accessing Instagram. Please try again.',
} as const;

export type InstagramErrorCode = 10 | 24 | 100 | 190;