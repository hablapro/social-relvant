import React from 'react';
import { InstagramMedia } from '../../lib/api/instagram/types';
import { Play } from 'lucide-react';
import { formatDate } from '../../utils/date';

interface Props {
  reels: InstagramMedia[];
}

export default function ReelsGrid({ reels }: Props) {
  if (!reels.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No reels found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {reels.map((reel) => (
        <div key={reel.id} className="bg-white rounded-lg shadow overflow-hidden">
          <div className="relative aspect-video">
            {reel.thumbnail_url ? (
              <img
                src={reel.thumbnail_url}
                alt={reel.caption?.slice(0, 50) || 'Reel thumbnail'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <Play className="w-12 h-12 text-gray-400" />
              </div>
            )}
            <div className="absolute bottom-2 right-2 bg-black/75 rounded-full p-2 text-white text-sm flex items-center gap-1">
              <Play className="w-4 h-4" />
              {reel.plays_count?.toLocaleString() || 0}
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-900 line-clamp-2 mb-2">
              {reel.caption || 'No caption'}
            </p>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <div className="flex items-center gap-3">
                <span>{reel.like_count.toLocaleString()} likes</span>
                <span>{reel.comments_count.toLocaleString()} comments</span>
              </div>
              <time>{formatDate(reel.timestamp)}</time>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}