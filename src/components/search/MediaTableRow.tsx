import React from 'react';
import { ChevronDown, ExternalLink, Copy, Check } from 'lucide-react';
import { InstagramMedia } from '../../lib/api/instagram/types';
import MediaTypeIcon from '../engagement/MediaTypeIcon';
import { formatDate } from '../../utils/date';
import { calculateEngagementRate, getTotalInteractions } from '../../utils/engagement';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';

interface Props {
  item: InstagramMedia;
  followersCount: number;
  isExpanded: boolean;
  onToggleCaption: () => void;
  onShowDescription: () => void;
  isSelected: boolean;
  onSelect: () => void;
}

export default function MediaTableRow({ 
  item, 
  followersCount,
  isExpanded, 
  onToggleCaption,
  onShowDescription,
  isSelected,
  onSelect
}: Props) {
  const { copied, copyToClipboard } = useCopyToClipboard();
  const totalInteractions = getTotalInteractions(item);
  const engagementRate = calculateEngagementRate(totalInteractions, followersCount);

  return (
    <tr className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}>
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <MediaTypeIcon type={item.media_type} isReel={item.is_reel} />
      </td>
      <td className="px-6 py-4 max-w-xs">
        {item.caption ? (
          <div>
            <p className="line-clamp-2">{item.caption}</p>
            {item.caption.length > 100 && (
              <button
                onClick={onShowDescription}
                className="text-blue-600 hover:text-blue-800 text-sm mt-1 flex items-center"
              >
                Show more <ChevronDown className="ml-1 w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <span className="text-gray-400">No caption</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {item.permalink && (
          <div className="flex items-center justify-end space-x-2">
            <a
              href={item.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
            <button
              onClick={() => copyToClipboard(item.permalink!)}
              className="text-gray-500 hover:text-gray-700"
              title="Copy link"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        {formatDate(item.timestamp)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        {totalInteractions.toLocaleString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        {engagementRate.toFixed(2)}%
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        {item.like_count.toLocaleString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        {item.comments_count.toLocaleString()}
      </td>
    </tr>
  );
}