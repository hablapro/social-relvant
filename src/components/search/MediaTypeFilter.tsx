import React from 'react';
import { MediaType } from '../../types';
import { Image, Film, Layers, Play } from 'lucide-react';

interface Props {
  selectedTypes: Set<MediaType>;
  onTypeToggle: (type: MediaType) => void;
  availableTypes: MediaType[];
}

export default function MediaTypeFilter({ selectedTypes, onTypeToggle, availableTypes }: Props) {
  if (!availableTypes.length) return null;

  const getTypeIcon = (type: MediaType) => {
    switch (type) {
      case 'VIDEO':
        return <Film className="w-4 h-4 mr-1.5" />;
      case 'CAROUSEL_ALBUM':
        return <Layers className="w-4 h-4 mr-1.5" />;
      case 'REEL':
        return <Play className="w-4 h-4 mr-1.5" />;
      default:
        return <Image className="w-4 h-4 mr-1.5" />;
    }
  };

  const getTypeColor = (type: MediaType, isSelected: boolean) => {
    if (!isSelected) return 'bg-gray-50 text-gray-600 hover:bg-gray-100';
    
    switch (type) {
      case 'VIDEO':
        return 'bg-blue-50 text-blue-700 hover:bg-blue-100';
      case 'CAROUSEL_ALBUM':
        return 'bg-green-50 text-green-700 hover:bg-green-100';
      case 'REEL':
        return 'bg-pink-50 text-pink-700 hover:bg-pink-100';
      default:
        return 'bg-purple-50 text-purple-700 hover:bg-purple-100';
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 border-b">
      <span className="text-sm font-medium text-gray-700">Filter by type:</span>
      <div className="flex flex-wrap gap-3">
        {availableTypes.map((type) => {
          const isSelected = selectedTypes.has(type);
          return (
            <button
              key={type}
              onClick={() => onTypeToggle(type)}
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${getTypeColor(type, isSelected)}`}
            >
              {getTypeIcon(type)}
              {type}
            </button>
          );
        })}
      </div>
    </div>
  );
}