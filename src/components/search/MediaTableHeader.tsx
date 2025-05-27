import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { SortField, SortDirection } from '../../hooks/useMediaTable';

interface Props {
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

export default function MediaTableHeader({ sortField, sortDirection, onSort }: Props) {
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 w-4 h-4" />;
    return sortDirection === 'asc' ? 
      <ArrowUp className="ml-1 w-4 h-4" /> : 
      <ArrowDown className="ml-1 w-4 h-4" />;
  };

  const columns = [
    { id: 'type', label: 'Type', sortable: false },
    { id: 'caption', label: 'Caption', sortable: false },
    { id: 'link', label: 'Link', sortable: false },
    { id: 'timestamp', label: 'Date', sortable: true },
    { id: 'interactions', label: 'Interactions', sortable: true },
    { id: 'engagement', label: 'Engagement Rate', sortable: true },
    { id: 'likes', label: 'Likes', sortable: true },
    { id: 'comments', label: 'Comments', sortable: true }
  ];

  return (
    <>
      {columns.map(({ id, label, sortable }) => (
        <th
          key={id}
          onClick={sortable ? () => onSort(id as SortField) : undefined}
          className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
            sortable ? 'cursor-pointer' : ''
          } ${id === 'caption' ? 'text-left' : 'text-right'}`}
        >
          <div className={`flex items-center ${id === 'caption' ? '' : 'justify-end'}`}>
            {label}
            {sortable && <SortIcon field={id as SortField} />}
          </div>
        </th>
      ))}
    </>
  );
}