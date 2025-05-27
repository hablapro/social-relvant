import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface RecentSearch {
  id: string;
  query: string;
  created_at: string;
}

export function useRecentSearches() {
  const [searches, setSearches] = useState<RecentSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecentSearches() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('searches')
          .select('id, query, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        setSearches(data || []);
      } catch (err) {
        console.error('Failed to fetch recent searches:', err);
        setError('Failed to load recent searches');
      } finally {
        setLoading(false);
      }
    }

    fetchRecentSearches();
  }, []);

  return { searches, loading, error };
}