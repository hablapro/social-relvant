import React from 'react';
import { getRecentPostsCount } from '../../utils/date';
import type { Profile } from '../../types';

interface ProfileStatsProps {
  profile: Profile;
}

export default function ProfileStats({ profile }: ProfileStatsProps) {
  const recentPostsCount = profile.media ? getRecentPostsCount(profile.media) : 0;

  if (profile.platform === 'instagram') {
    return (
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <span className="block text-2xl font-semibold">
            {profile.followers_count.toLocaleString()}
          </span>
          <span className="text-sm text-gray-600">Followers</span>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <span className="block text-2xl font-semibold">
            {profile.following_count.toLocaleString()}
          </span>
          <span className="text-sm text-gray-600">Following</span>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <span className="block text-2xl font-semibold">
            {recentPostsCount}
          </span>
          <span className="text-sm text-gray-600">Posts (30 days)</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <span className="block text-2xl font-semibold">
          {profile.followers_count.toLocaleString()}
        </span>
        <span className="text-sm text-gray-600">Subscribers</span>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <span className="block text-2xl font-semibold">
          {profile.media?.length || 0}
        </span>
        <span className="text-sm text-gray-600">Videos</span>
      </div>
    </div>
  );
}