import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { searchInstagramProfile } from '../../lib/api/instagram/profile';
import { searchYouTubeChannel } from '../../lib/api/youtube';
import SearchResults from './SearchResults';
import { supabase } from '../../lib/supabase';
import PlatformSelector from './PlatformSelector';
import type { Platform } from '../../types';
import { useDebounce } from '../../hooks/useDebounce';

export default function SearchForm() {
  const [username, setUsername] = useState('');
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any | null>(null);
  
  const debouncedUsername = useDebounce(username, 500);

  useEffect(() => {
    if (debouncedUsername.trim()) {
      performSearch();
    } else {
      setResults(null);
      setError(null);
    }
  }, [debouncedUsername, platform]);

  const performSearch = async () => {
    if (!debouncedUsername.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const cleanUsername = debouncedUsername.trim().startsWith('@') 
        ? debouncedUsername.trim().slice(1) 
        : debouncedUsername.trim();

      // Save search to history
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('searches').insert({
          user_id: user.id,
          query: cleanUsername,
          platform,
          type: 'handle'
        });
      }

      let profile;
      if (platform === 'instagram') {
        profile = await searchInstagramProfile(cleanUsername);
      } else if (platform === 'youtube') {
        profile = await searchYouTubeChannel(cleanUsername);
      }

      if (!profile) {
        throw new Error(`${platform === 'instagram' ? 'Instagram profile' : 'YouTube channel'} not found`);
      }

      setResults({ profile });
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getPlaceholder = () => {
    if (platform === 'instagram') {
      return 'Enter Instagram @username...';
    }
    return 'Enter YouTube channel name...';
  };

  return (
    <div className="space-y-6">
      <div className="w-full max-w-2xl mx-auto space-y-4">
        <PlatformSelector platform={platform} setPlatform={setPlatform} />
        
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={getPlaceholder()}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {loading && (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
            </div>
          )}
        </div>
      </div>

      {(results || error) && (
        <SearchResults results={results} error={error} />
      )}
    </div>
  );
}