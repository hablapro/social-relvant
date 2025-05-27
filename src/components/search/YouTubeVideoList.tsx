import React, { useState } from 'react';
import { ExternalLink, X, Star, Download, ArrowUp, ArrowDown, ArrowUpDown, Copy, Check } from 'lucide-react';
import { formatDate } from '../../utils/date';
import { supabase } from '../../lib/supabase';
import type { YouTubeVideo } from '../../types';
import { useTablePagination } from '../../hooks/useTablePagination';
import TablePagination from '../common/TablePagination';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import DateRangeFilter from './DateRangeFilter';
import { useDateFilter } from '../../hooks/useDateFilter';

interface Props {
  videos: YouTubeVideo[];
  channelName: string;
  subscriberCount: number;
}

type SortField = 'title' | 'views' | 'likes' | 'comments' | 'date';
type SortDirection = 'asc' | 'desc';

interface DescriptionModalProps {
  caption: string;
  onClose: () => void;
}

function DescriptionModal({ caption, onClose }: DescriptionModalProps) {
  const { copied, copyToClipboard } = useCopyToClipboard();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">Description</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          <p className="whitespace-pre-wrap text-gray-700">{caption}</p>
          <button
            onClick={() => copyToClipboard(caption)}
            className="mt-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2 text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy to Clipboard
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function YouTubeVideoList({ videos, channelName, subscriberCount }: Props) {
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const { copied, copyToClipboard } = useCopyToClipboard();
  const { days, setDays, dateRange } = useDateFilter();
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const filteredVideos = React.useMemo(() => {
    return videos.filter(video => {
      const videoDate = new Date(video.publishedAt);
      return videoDate >= dateRange.start && videoDate <= dateRange.end;
    });
  }, [videos, dateRange]);

  const sortedVideos = React.useMemo(() => {
    return [...filteredVideos].sort((a, b) => {
      const multiplier = sortDirection === 'asc' ? 1 : -1;
      switch (sortField) {
        case 'title':
          return a.title.localeCompare(b.title) * multiplier;
        case 'views':
          return (a.viewCount - b.viewCount) * multiplier;
        case 'likes':
          return (a.likeCount - b.likeCount) * multiplier;
        case 'comments':
          return (a.commentCount - b.commentCount) * multiplier;
        case 'date':
          return (new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()) * multiplier;
        default:
          return 0;
      }
    });
  }, [filteredVideos, sortField, sortDirection]);

  const {
    currentItems: paginatedVideos,
    currentPage,
    totalPages,
    itemsPerPage,
    setItemsPerPage,
    nextPage,
    prevPage,
    goToPage,
    pageSizeOptions,
    hasNextPage,
    hasPrevPage
  } = useTablePagination(sortedVideos);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 w-4 h-4" />;
    return sortDirection === 'asc' ? 
      <ArrowUp className="ml-1 w-4 h-4" /> : 
      <ArrowDown className="ml-1 w-4 h-4" />;
  };

  const handleRowSelect = (videoId: string) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedVideos.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedVideos.map(video => video.id)));
    }
  };

  const handleDownload = () => {
    const videosToDownload = sortedVideos.filter(video => 
      selectedRows.size === 0 || selectedRows.has(video.id)
    );

    const csvContent = [
      ['Title', 'Description', 'Link', 'Date', 'Views', 'Likes', 'Comments'].join(','),
      ...videosToDownload.map(video => [
        `"${video.title.replace(/"/g, '""')}"`,
        `"${video.description.replace(/"/g, '""')}"`,
        `"${video.link}"`,
        `"${formatDate(video.publishedAt)}"`,
        video.viewCount,
        video.likeCount,
        video.commentCount
      ].join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${channelName}_youtube_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!videos.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No videos found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <DateRangeFilter value={days} onChange={setDays} />
        <button
          onClick={handleDownload}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Download className="w-4 h-4 mr-2" />
          Download {selectedRows.size ? `Selected (${selectedRows.size})` : 'All'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500">
                <input
                  type="checkbox"
                  checked={selectedRows.size === paginatedVideos.length}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thumbnail
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center">
                  Title
                  <SortIcon field="title" />
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Link
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right cursor-pointer"
                onClick={() => handleSort('views')}
              >
                <div className="flex items-center justify-end">
                  Views
                  <SortIcon field="views" />
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right cursor-pointer"
                onClick={() => handleSort('likes')}
              >
                <div className="flex items-center justify-end">
                  Likes
                  <SortIcon field="likes" />
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right cursor-pointer"
                onClick={() => handleSort('comments')}
              >
                <div className="flex items-center justify-end">
                  Comments
                  <SortIcon field="comments" />
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right cursor-pointer"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center justify-end">
                  Date
                  <SortIcon field="date" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedVideos.map((video) => (
              <tr 
                key={video.id} 
                className={`hover:bg-gray-50 ${selectedRows.has(video.id) ? 'bg-blue-50' : ''}`}
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(video.id)}
                    onChange={() => handleRowSelect(video.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-32 h-20 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-900">
                    {video.title}
                  </p>
                </td>
                <td className="px-6 py-4 max-w-xs">
                  <div>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {video.description}
                    </p>
                    {video.description.length > 100 && (
                      <button
                        onClick={() => setSelectedVideo(video)}
                        className="text-blue-600 hover:text-blue-800 text-sm mt-1"
                      >
                        Show more
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <a
                      href={video.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:text-red-800"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                    <button
                      onClick={() => copyToClipboard(video.link)}
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
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                  {video.viewCount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                  {video.likeCount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                  {video.commentCount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                  {formatDate(video.publishedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          pageSizeOptions={pageSizeOptions}
          onPageChange={goToPage}
          onItemsPerPageChange={setItemsPerPage}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
        />
      </div>

      {selectedVideo && (
        <DescriptionModal
          caption={selectedVideo.description}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
}