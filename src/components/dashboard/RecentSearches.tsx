import React from 'react';
import { History, Search } from 'lucide-react';
import { useRecentSearches } from '../../hooks/useRecentSearches';
import { formatDate } from '../../utils/date';

export default function RecentSearches() {
  const { searches, loading, error } = useRecentSearches();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Recent Searches</h3>
          <History className="text-gray-400" />
        </div>
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-3/4" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Recent Searches</h3>
          <History className="text-gray-400" />
        </div>
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Recent Searches</h3>
        <History className="text-gray-400" />
      </div>
      <div className="space-y-4">
        {searches.length === 0 ? (
          <p className="text-gray-500">No recent searches</p>
        ) : (
          <div className="space-y-3">
            {searches.map((search) => (
              <div
                key={search.id}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">@{search.query}</span>
                </div>
                <time className="text-gray-500 text-xs">
                  {formatDate(search.created_at)}
                </time>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}