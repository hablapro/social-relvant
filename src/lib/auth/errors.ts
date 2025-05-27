export class AuthenticationError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export const AUTH_ERRORS = {
  NO_USER: 'No authenticated user found',
  INVALID_CREDENTIALS: 'Invalid email or password',
  PROFILE_CREATION_FAILED: 'Failed to create user profile',
  EMAIL_IN_USE: 'This email is already registered',
  WEAK_PASSWORD: 'Password must be at least 6 characters long',
  INVALID_EMAIL: 'Please enter a valid email address',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
} as const;