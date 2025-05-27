import { useState, useEffect } from 'react';

export function useSearchPersistence(platform: 'instagram' | 'youtube') {
  const [query, setQuery] = useState('');

  // Load saved query on mount
  useEffect(() => {
    const savedQuery = localStorage.getItem(`${platform}_last_search`);
    if (savedQuery) {
      setQuery(savedQuery);
    }
  }, [platform]);

  // Save query when it changes
  const updateQuery = (newQuery: string) => {
    setQuery(newQuery);
    localStorage.setItem(`${platform}_last_search`, newQuery);
  };

  return { query, updateQuery };
}