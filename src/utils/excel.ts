import { InstagramMedia } from '../lib/api/instagram/types';
import { formatDate } from './date';
import { getTotalInteractions, calculateEngagementRate } from './engagement';

export function generateExcelData(media: InstagramMedia[], followersCount: number) {
  // Create CSV content with matching headers
  const headers = [
    'Type',
    'Caption',
    'Link',
    'Date',
    'Total Interactions',
    'Engagement Rate (%)',
    'Likes',
    'Comments',
    'Plays'
  ].join(',');

  const rows = media.map(item => {
    const totalInteractions = getTotalInteractions(item);
    const engagementRate = calculateEngagementRate(totalInteractions, followersCount);
    
    // Format date as a string that Excel will recognize as a single cell
    const formattedDate = `"${formatDate(item.timestamp)}"`; // Wrap in quotes to ensure it's treated as text
    
    return [
      item.is_reel ? 'REEL' : item.media_type,
      `"${(item.caption || '').replace(/"/g, '""')}"`, // Escape quotes for CSV
      `"${item.permalink || ''}"`, // Wrap URL in quotes
      formattedDate,
      totalInteractions,
      engagementRate.toFixed(2),
      item.like_count,
      item.comments_count,
      item.plays_count || 0
    ].join(',');
  });

  return [headers, ...rows].join('\n');
}

export function downloadExcel(data: string, filename: string) {
  const blob = new Blob(['\ufeff' + data], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}