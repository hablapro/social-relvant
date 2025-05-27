import React from 'react';
import { Calendar } from 'lucide-react';

interface Props {
  value: '30' | '90' | '180';
  onChange: (days: '30' | '90' | '180') => void;
}

export default function DateRangeFilter({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
      <Calendar className="w-5 h-5 text-gray-400" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as '30' | '90' | '180')}
        className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
      >
        <option value="30">Last 30 days</option>
        <option value="90">Last 90 days</option>
        <option value="180">Last 180 days</option>
      </select>
    </div>
  );
}