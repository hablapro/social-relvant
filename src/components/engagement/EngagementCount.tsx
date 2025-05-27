import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';

interface Props {
  likes: number;
  comments: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function EngagementCount({ likes, comments, size = 'sm' }: Props) {
  const iconSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24;
  const textSize = size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg';

  return (
    <div className="flex items-center space-x-4">
      <span className={`flex items-center ${textSize} text-gray-500`}>
        <Heart className={`w-${iconSize/4} h-${iconSize/4} mr-1`} />
        {likes.toLocaleString()}
      </span>
      <span className={`flex items-center ${textSize} text-gray-500`}>
        <MessageCircle className={`w-${iconSize/4} h-${iconSize/4} mr-1`} />
        {comments.toLocaleString()}
      </span>
    </div>
  );
}