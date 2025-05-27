import { InstagramMedia } from '../lib/api/instagram/types';

export function calculateEngagementRate(
  interactions: number,
  followersCount: number
): number {
  if (!followersCount) return 0;
  return (interactions / followersCount) * 100;
}

export function getTotalInteractions(media: InstagramMedia): number {
  return (
    media.like_count +
    media.comments_count +
    (media.plays_count || 0)
  );
}