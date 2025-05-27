import React from 'react';
import { AlertCircle, Youtube, Instagram, Star } from 'lucide-react';
import MediaTable from './MediaTable';
import SearchError from './SearchError';
import ProfileStats from './ProfileStats';
import YouTubeVideoList from './YouTubeVideoList';
import { supabase } from '../../lib/supabase';
import type { SearchResultsProps } from './types';

export default function SearchResults({ results, error }: SearchResultsProps) {
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (results?.profile) {
      checkIfFavorite();
    }
  }, [results?.profile]);

  async function checkIfFavorite() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !results?.profile) return;

      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('platform', results.profile.platform)
        .eq('profile_username', results.profile.username)
        .maybeSingle();

      setIsFavorite(!!data);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleFavorite() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !results?.profile) return;

      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('platform', results.profile.platform)
          .eq('profile_username', results.profile.username);
        setIsFavorite(false);
      } else {
        await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            platform: results.profile.platform,
            profile_username: results.profile.username,
            profile_name: results.profile.display_name,
            profile_picture: results.profile.profile_picture_url
          });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  }

  if (error) {
    return <SearchError message={error} />;
  }

  if (!results) {
    return null;
  }

  const PlatformIcon = results.profile?.platform === 'youtube' ? Youtube : Instagram;
  const platformColor = results.profile?.platform === 'youtube' ? 'text-red-600' : 'text-pink-600';

  return (
    <div className="space-y-8">
      {results.profile && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {results.profile.profile_picture_url && (
                <img
                  src={results.profile.profile_picture_url}
                  alt={results.profile.username}
                  className="w-16 h-16 rounded-full"
                />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <PlatformIcon className={`w-5 h-5 ${platformColor}`} />
                  <h2 className="text-xl font-semibold">
                    {results.profile.display_name || results.profile.username}
                  </h2>
                  <button
                    onClick={toggleFavorite}
                    disabled={loading}
                    className={`ml-2 p-1 rounded-full transition-colors ${
                      isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                    }`}
                  >
                    <Star className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <p className="text-gray-600">
                  {results.profile.platform === 'youtube' ? '' : '@'}
                  {results.profile.username}
                </p>
              </div>
            </div>
          </div>

          {results.profile.bio && (
            <p className="text-gray-700">{results.profile.bio}</p>
          )}

          <ProfileStats profile={results.profile} />
        </div>
      )}

      {results.profile?.media && results.profile.platform === 'instagram' && (
        <MediaTable 
          media={results.profile.media} 
          followersCount={results.profile.followers_count} 
        />
      )}

      {results.profile?.media && results.profile.platform === 'youtube' && (
        <YouTubeVideoList 
          videos={results.profile.media}
          channelName={results.profile.username}
          subscriberCount={results.profile.followers_count}
        />
      )}
    </div>
  );
}