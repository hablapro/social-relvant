import { InstagramMedia } from './types';
import { instagramFetch } from './client';
import { BUSINESS_ACCOUNT_ID } from './constants';
import { buildProfileQuery } from './queries';
import { APIError } from '../base';

export async function getInstagramMedia(username: string): Promise<InstagramMedia[]> {
  try {
    const data = await instagramFetch<{
      business_discovery: {
        media: {
          data: InstagramMedia[];
          paging?: {
            cursors: {
              before: string;
              after: string;
            };
          };
        };
      };
    }>(`/${BUSINESS_ACCOUNT_ID}`, {
      fields: buildProfileQuery(username)
    });

    if (!data.business_discovery?.media?.data) {
      throw new APIError('No media found', 'instagram');
    }

    return data.business_discovery.media.data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(
      error instanceof Error ? error.message : 'Failed to fetch Instagram media',
      'instagram'
    );
  }
}