import { APIError } from '../base';
import { instagramFetch } from './client';

export async function verifyInstagramToken() {
  try {
    const { data: { user } } = await instagramFetch<{ data: { user: any } }>('/me');
    
    if (!user) {
      throw new APIError(
        'Invalid Instagram access token or insufficient permissions.',
        'instagram',
        401
      );
    }
    
    return user;
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError(
      'Failed to verify Instagram access token. Please check your credentials.',
      'instagram',
      401
    );
  }
}