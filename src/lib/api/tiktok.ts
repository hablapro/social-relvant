import { Profile, Post } from '../../types';
import { API_CONFIG } from '../../config/api';

export async function searchTikTokProfile(username: string): Promise<Profile | null> {
  try {
    const response = await fetch(
      `${API_CONFIG.tiktok.baseUrl}/user/info/?fields=open_id,union_id,avatar_url,bio_description,follower_count,following_count,username&access_token=${API_CONFIG.tiktok.accessToken}`
    );
    
    if (!response.ok) throw new Error('Failed to fetch TikTok profile');
    
    const data = await response.json();
    
    return {
      id: data.open_id,
      platform_id: data.open_id,
      platform: 'tiktok',
      username: data.username,
      followers_count: data.follower_count,
      following_count: data.following_count,
      bio: data.bio_description,
    };
  } catch (error) {
    console.error('TikTok API Error:', error);
    return null;
  }
}

export async function searchTikTokHashtag(tag: string): Promise<Post[]> {
  try {
    const response = await fetch(
      `${API_CONFIG.tiktok.baseUrl}/hashtag/info/?hashtag_name=${tag}&access_token=${API_CONFIG.tiktok.accessToken}`
    );
    
    if (!response.ok) throw new Error('Failed to fetch TikTok hashtag');
    
    const data = await response.json();
    
    // Get videos for the hashtag
    const videosResponse = await fetch(
      `${API_CONFIG.tiktok.baseUrl}/hashtag/search/videos/?hashtag_id=${data.hashtag_id}&access_token=${API_CONFIG.tiktok.accessToken}`
    );
    
    if (!videosResponse.ok) throw new Error('Failed to fetch hashtag videos');
    
    const videosData = await videosResponse.json();
    
    return videosData.videos.map((video: any) => ({
      id: video.id,
      platform_post_id: video.id,
      platform: 'tiktok',
      profile_id: video.author.open_id,
      content: video.desc,
      engagement_count: video.like_count + video.comment_count + video.share_count,
      posted_at: video.create_time,
    }));
  } catch (error) {
    console.error('TikTok API Error:', error);
    return [];
  }
}