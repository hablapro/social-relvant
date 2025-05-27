import React from 'react';
import { Download } from 'lucide-react';
import { generateExcelData, downloadExcel } from '../../utils/excel';
import type { InstagramMedia } from '../../lib/api/instagram/types';

interface DownloadButtonProps {
  media: InstagramMedia[];
  username: string;
  followersCount: number;
}

export default function DownloadButton({ media, username, followersCount }: DownloadButtonProps) {
  const handleDownload = () => {
    const data = generateExcelData(media, followersCount);
    const filename = `${username}_instagram_data_${new Date().toISOString().split('T')[0]}.csv`;
    downloadExcel(data, filename);
  };

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <Download className="w-4 h-4 mr-2" />
      Download Data
    </button>
  );
}