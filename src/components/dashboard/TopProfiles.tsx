import React from 'react';
import { User } from 'lucide-react';

export default function TopProfiles() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Top Profiles</h3>
        <User className="text-gray-400" />
      </div>
      <div className="space-y-4">
        {/* TODO: Add top profiles list */}
        <p className="text-gray-500">No profiles found</p>
      </div>
    </div>
  );
}