import React from 'react';
import { Hash } from 'lucide-react';

export default function TrendingHashtags() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Trending Hashtags</h3>
        <Hash className="text-gray-400" />
      </div>
      <div className="space-y-4">
        {/* TODO: Add trending hashtags list */}
        <p className="text-gray-500">No trending hashtags</p>
      </div>
    </div>
  );
}