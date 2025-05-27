import React from 'react';
import { Instagram, Youtube } from 'lucide-react';
import type { Platform } from '../../types';

interface Props {
  platform: Platform;
  setPlatform: (platform: Platform) => void;
}

export default function PlatformSelector({ platform, setPlatform }: Props) {
  return (
    <div className="flex gap-4 justify-center">
      <button
        onClick={() => setPlatform('instagram')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          platform === 'instagram'
            ? 'bg-pink-100 text-pink-700'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <Instagram className="w-5 h-5" />
        <span className="font-medium">Instagram</span>
      </button>
      <button
        onClick={() => setPlatform('youtube')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          platform === 'youtube'
            ? 'bg-red-100 text-red-700'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <Youtube className="w-5 h-5" />
        <span className="font-medium">YouTube</span>
      </button>
    </div>
  );
}