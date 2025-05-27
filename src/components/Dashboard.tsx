import React from 'react';
import { User } from 'lucide-react';
import SearchForm from './search/SearchForm';
import RecentSearches from './dashboard/RecentSearches';

export default function Dashboard() {
  return (
    <div>
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Search Social Profiles</h2>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <User className="w-4 h-4 mr-1" />
            Handles
          </span>
        </div>
        <SearchForm />
      </div>

      <div className="max-w-2xl mx-auto">
        <RecentSearches />
      </div>
    </div>
  );
}