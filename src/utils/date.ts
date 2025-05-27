import { InstagramMedia } from '../lib/api/instagram/types';

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function getRecentPostsCount(media: InstagramMedia[], days: number = 30): number {
  const now = new Date();
  const threshold = new Date(now.setDate(now.getDate() - days));
  
  return media.filter(post => new Date(post.timestamp) >= threshold).length;
}

export function filterMediaByDateRange(
  media: InstagramMedia[],
  startDate: string,
  endDate: string
): InstagramMedia[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999); // Include the entire end date
  
  return media.filter(item => {
    const postDate = new Date(item.timestamp);
    return postDate >= start && postDate <= end;
  });
}