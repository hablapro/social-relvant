import { Platform } from '../../types';

export class APIError extends Error {
  constructor(
    message: string,
    public platform: Platform,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleAPIError(error: unknown, platform: Platform): never {
  if (error instanceof APIError) {
    throw error;
  }
  if (error instanceof Error) {
    throw new APIError(`${platform} API: ${error.message}`, platform);
  }
  throw new APIError(`${platform} API: An unexpected error occurred`, platform);
}