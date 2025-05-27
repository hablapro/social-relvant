import React, { useState } from 'react';
import { InstagramMedia } from '../../lib/api/instagram/types';
import MediaTypeFilter from './MediaTypeFilter';
import MediaTableHeader from './MediaTableHeader';
import MediaTableRow from './MediaTableRow';
import TablePagination from '../common/TablePagination';
import { useMediaTable } from '../../hooks/useMediaTable';
import DescriptionModal from './DescriptionModal';
import DateRangeFilter from './DateRangeFilter';
import { useDateFilter } from '../../hooks/useDateFilter';
import { Download } from 'lucide-react';
import { generateExcelData, downloadExcel } from '../../utils/excel';

interface Props {
  media: InstagramMedia[];
  followersCount: number;
}

export default function MediaTable({ media, followersCount }: Props) {
  const [selectedCaption, setSelectedCaption] = useState<string | null>(null);
  const { days, setDays, dateRange } = useDateFilter();
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const filteredMedia = React.useMemo(() => {
    return media.filter(item => {
      const postDate = new Date(item.timestamp);
      return postDate >= dateRange.start && postDate <= dateRange.end;
    });
  }, [media, dateRange]);

  const {
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
  } = useMediaTable(filteredMedia, followersCount);

  const handleRowSelect = (id: string) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedMedia.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedMedia.map(item => item.id)));
    }
  };

  const handleDownload = () => {
    const mediaToDownload = filteredMedia.filter(item => 
      selectedRows.size === 0 || selectedRows.has(item.id)
    );
    
    const data = generateExcelData(mediaToDownload, followersCount);
    const filename = `instagram_data_${new Date().toISOString().split('T')[0]}.csv`;
    downloadExcel(data, filename);
  };

  if (!media.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No media found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-4">
          <DateRangeFilter value={days} onChange={setDays} />
          <div className="h-8 w-px bg-gray-300" /> {/* Vertical divider */}
          <button
            onClick={handleDownload}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="w-4 h-4 mr-2" />
            Download {selectedRows.size ? `Selected (${selectedRows.size})` : 'All'}
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <MediaTypeFilter
          selectedTypes={selectedTypes}
          onTypeToggle={handleTypeToggle}
          availableTypes={availableTypes}
        />
        
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-500">
                <input
                  type="checkbox"
                  checked={selectedRows.size === paginatedMedia.length}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              <MediaTableHeader
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={toggleSort}
              />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedMedia.map((item) => (
              <MediaTableRow
                key={item.id}
                item={item}
                followersCount={followersCount}
                isExpanded={expandedCaptions.has(item.id)}
                onToggleCaption={() => toggleCaption(item.id)}
                onShowDescription={() => setSelectedCaption(item.caption || '')}
                isSelected={selectedRows.has(item.id)}
                onSelect={() => handleRowSelect(item.id)}
              />
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

      {selectedCaption !== null && (
        <DescriptionModal
          caption={selectedCaption}
          onClose={() => setSelectedCaption(null)}
        />
      )}
    </div>
  );
}