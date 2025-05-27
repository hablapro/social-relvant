import { useState, useMemo } from 'react';
import { InstagramMedia } from '../lib/api/instagram/types';
import { MediaType } from '../types';
import { getTotalInteractions } from '../utils/engagement';
import { useTablePagination } from './useTablePagination';

export type SortField = 'likes' | 'comments' | 'plays' | 'timestamp' | 'interactions' | 'engagement';
export type SortDirection = 'asc' | 'desc';

export function useMediaTable(media: InstagramMedia[], followersCount: number) {
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [expandedCaptions, setExpandedCaptions] = useState<Set<string>>(new Set());

  const availableTypes = useMemo(() => {
    const types = new Set<MediaType>();
    media.forEach(item => {
      const type = item.is_reel ? 'REEL' : item.media_type;
      if (type) {
        types.add(type as MediaType);
      }
    });
    return Array.from(types);
  }, [media]);

  const [selectedTypes, setSelectedTypes] = useState<Set<MediaType>>(new Set(availableTypes));

  useMemo(() => {
    setSelectedTypes(new Set(availableTypes));
  }, [availableTypes]);

  const handleTypeToggle = (type: MediaType) => {
    setSelectedTypes(prev => {
      const newTypes = new Set(prev);
      if (newTypes.has(type)) {
        newTypes.delete(type);
      } else {
        newTypes.add(type);
      }
      return newTypes;
    });
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const toggleCaption = (id: string) => {
    setExpandedCaptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const filteredAndSortedMedia = useMemo(() => {
    return [...media]
      .filter(item => {
        const type = item.is_reel ? 'REEL' : (item.media_type as MediaType);
        return selectedTypes.has(type);
      })
      .sort((a, b) => {
        const multiplier = sortDirection === 'asc' ? 1 : -1;
        switch (sortField) {
          case 'likes':
            return (a.like_count - b.like_count) * multiplier;
          case 'comments':
            return (a.comments_count - b.comments_count) * multiplier;
          case 'plays':
            return ((a.plays_count || 0) - (b.plays_count || 0)) * multiplier;
          case 'interactions':
            return (getTotalInteractions(a) - getTotalInteractions(b)) * multiplier;
          case 'engagement':
            const engagementA = (getTotalInteractions(a) / followersCount) * 100;
            const engagementB = (getTotalInteractions(b) / followersCount) * 100;
            return (engagementA - engagementB) * multiplier;
          case 'timestamp':
            return (new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) * multiplier;
          default:
            return 0;
        }
      });
  }, [media, selectedTypes, sortField, sortDirection, followersCount]);

  const {
    currentItems: paginatedMedia,
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
  } = useTablePagination(filteredAndSortedMedia);

  return {
    availableTypes,
    selectedTypes,
    sortField,
    sortDirection,
    expandedCaptions,
    paginatedMedia,
    currentPage,
    totalPages,
    itemsPerPage,
    setItemsPerPage,
    nextPage,
    prevPage,
    goToPage,
    pageSizeOptions,
    hasNextPage,
    hasPrevPage,
    handleTypeToggle,
    toggleSort,
    toggleCaption,
  };
}