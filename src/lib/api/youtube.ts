import { Profile, YouTubeVideo } from '../../types';
import { API_CONFIG } from '../../config/api';
import { APIError } from './base';

export async function searchYouTubeChannel(username: string): Promise<Profile> {
  try {
    if (!API_CONFIG.youtube.apiKey) {
      throw new APIError('YouTube API key is not configured', 'youtube', 401);
    }

    // Clean up username (remove @ if present)
    const cleanUsername = username.startsWith('@') ? username.slice(1) : username;

    // First search for the channel
    const searchResponse = await fetch(
      `${API_CONFIG.youtube.baseUrl}/search?part=snippet&q=${encodeURIComponent(cleanUsername)}&type=channel&maxResults=1&key=${API_CONFIG.youtube.apiKey}`
    );
    
    const searchData = await searchResponse.json();
    
    if (!searchResponse.ok) {
      throw new APIError(
        searchData.error?.message || 'Failed to fetch YouTube channel',
        'youtube',
        searchResponse.status
      );
    }
    
    if (!searchData.items?.length) {
      throw new APIError('YouTube channel not found', 'youtube', 404);
    }
    
    const channelId = searchData.items[0].id.channelId;

    // Get detailed channel information
    const channelResponse = await fetch(
      `${API_CONFIG.youtube.baseUrl}/channels?part=snippet,statistics&id=${channelId}&key=${API_CONFIG.youtube.apiKey}`
    );
    
    const channelData = await channelResponse.json();
    
    if (!channelResponse.ok) {
      throw new APIError(
        channelData.error?.message || 'Failed to fetch channel details',
        'youtube',
        channelResponse.status
      );
    }
    
    if (!channelData.items?.length) {
      throw new APIError('Channel details not found', 'youtube', 404);
    }
    
    const channel = channelData.items[0];

    // Get channel's videos with more details
    const videosResponse = await fetch(
      `${API_CONFIG.youtube.baseUrl}/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=50&key=${API_CONFIG.youtube.apiKey}`
    );

    const videosData = await videosResponse.json();

    if (!videosResponse.ok) {
      throw new APIError(
        videosData.error?.message || 'Failed to fetch channel videos',
        'youtube',
        videosResponse.status
      );
    }

    let videos: YouTubeVideo[] = [];

    if (videosData.items?.length) {
      // Get video IDs for detailed statistics
      const videoIds = videosData.items.map((item: any) => item.id.videoId).join(',');

      // Get detailed video statistics
      const videoStatsResponse = await fetch(
        `${API_CONFIG.youtube.baseUrl}/videos?part=statistics,snippet&id=${videoIds}&key=${API_CONFIG.youtube.apiKey}`
      );

      const videoStatsData = await videoStatsResponse.json();

      if (!videoStatsResponse.ok) {
        throw new APIError(
          videoStatsData.error?.message || 'Failed to fetch video statistics',
          'youtube',
          videoStatsResponse.status
        );
      }

      videos = videoStatsData.items.map((video: any) => ({
        id: video.id,
        thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default?.url,
        title: video.snippet.title,
        description: video.snippet.description,
        publishedAt: video.snippet.publishedAt,
        link: `https://www.youtube.com/watch?v=${video.id}`,
        viewCount: parseInt(video.statistics.viewCount) || 0,
        likeCount: parseInt(video.statistics.likeCount) || 0,
        commentCount: parseInt(video.statistics.commentCount) || 0
      }));
    }

    return {
      id: channel.id,
      platform_id: channel.id,
      platform: 'youtube',
      username: channel.snippet.customUrl || cleanUsername,
      display_name: channel.snippet.title,
      followers_count: parseInt(channel.statistics.subscriberCount) || 0,
      following_count: 0,
      bio: channel.snippet.description,
      profile_picture_url: channel.snippet.thumbnails.high?.url || channel.snippet.thumbnails.default?.url,
      media: videos
    };
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      'youtube',
      500
    );
  }
}