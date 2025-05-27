import React from 'react';
import { Image, Film, Layers, Play } from 'lucide-react';
import { MediaType } from '../../types';

interface Props {
  type: MediaType;
  isReel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function MediaTypeIcon({ type, isReel = false, size = 'sm' }: Props) {
  const iconSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24;
  const getIconColor = () => {
    if (isReel) return 'text-pink-500';
    switch (type) {
      case 'VIDEO':
        return 'text-blue-500';
      case 'CAROUSEL_ALBUM':
        return 'text-green-500';
      default:
        return 'text-purple-500';
    }
  };

  const IconComponent = isReel ? Play : 
    type === 'VIDEO' ? Film : 
    type === 'CAROUSEL_ALBUM' ? Layers : 
    Image;

  return (
    <div className="flex items-center gap-1.5">
      <IconComponent className={`w-${iconSize/4} h-${iconSize/4} ${getIconColor()}`} />
      <span className="text-sm text-gray-900">
        {isReel ? 'REEL' : type}
      </span>
    </div>
  );
}