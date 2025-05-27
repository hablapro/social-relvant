import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Platform = 'instagram' | 'youtube' | 'tiktok';
type SearchType = 'handle' | 'hashtag';

export default function SearchForm() {
  const [query, setQuery] = useState('');
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [type, setType] = useState<SearchType>('handle');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');

      await supabase.from('searches').insert({
        query,
        platform,
        type,
        user_id: user.id
      });

      // TODO: Implement API calls to fetch social media data
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Enter ${type}...`}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? (
            'Searching...'
          ) : (
            <div className="flex items-center gap-2">
              <Search size={20} />
              <span>Search</span>
            </div>
          )}
        </button>
      </div>

      <div className="flex gap-4">
        <div className="space-x-4">
          <label className="font-medium">Platform:</label>
          {(['instagram', 'youtube', 'tiktok'] as Platform[]).map((p) => (
            <label key={p} className="inline-flex items-center">
              <input
                type="radio"
                name="platform"
                value={p}
                checked={platform === p}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className="mr-2"
              />
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </label>
          ))}
        </div>

        <div className="space-x-4">
          <label className="font-medium">Type:</label>
          {(['handle', 'hashtag'] as SearchType[]).map((t) => (
            <label key={t} className="inline-flex items-center">
              <input
                type="radio"
                name="type"
                value={t}
                checked={type === t}
                onChange={(e) => setType(e.target.value as SearchType)}
                className="mr-2"
              />
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </label>
          ))}
        </div>
      </div>
    </form>
  );
}