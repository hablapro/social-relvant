import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { searchYouTubeChannel } from '../../lib/api/youtube';
import SearchResults from '../search/SearchResults';
import { supabase } from '../../lib/supabase';
import { useSearchPersistence } from '../../hooks/useSearchPersistence';

export default function YouTubeSearch() {
  const { query, updateQuery } = useSearchPersistence('youtube');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any | null>(null);

  const performSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const cleanUsername = query.trim();

      // Save search to history
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('searches').insert({
          user_id: user.id,
          query: cleanUsername,
          platform: 'youtube',
          type: 'handle'
        });
      }

      const profile = await searchYouTubeChannel(cleanUsername);

      if (!profile) {
        throw new Error('YouTube channel not found');
      }

      setResults({ profile });
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Perform initial search if there's a saved query
  React.useEffect(() => {
    if (query) {
      performSearch();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  return (
    <div className="space-y-6">
      <div className="w-full max-w-2xl mx-auto space-y-4">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => updateQuery(e.target.value)}
              placeholder="Enter YouTube channel name..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Search</span>
              </>
            )}
          </button>
        </form>
      </div>

      {(results || error) && (
        <SearchResults results={results} error={error} />
      )}
    </div>
  );
}