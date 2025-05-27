import React, { useState, useEffect } from 'react';
import { getInstagramReels } from '../../lib/api/instagram/reels';
import ReelsGrid from './ReelsGrid';
import { Play } from 'lucide-react';

interface Props {
  username: string;
}

export default function ReelsSection({ username }: Props) {
  const [reels, setReels] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReels() {
      try {
        const reelsData = await getInstagramReels(username);
        setReels(reelsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch reels');
      } finally {
        setLoading(false);
      }
    }

    fetchReels();
  }, [username]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-600 rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 my-4">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Play className="w-5 h-5 text-pink-500" />
        <h2 className="text-xl font-semibold">Reels</h2>
      </div>
      <ReelsGrid reels={reels} />
    </div>
  );
}