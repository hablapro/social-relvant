import React from 'react';
import { LogOut, Star, Youtube, Instagram } from 'lucide-react';
import { useAuth } from './auth';
import ProfileDropdown from './ProfileDropdown';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const { signOut } = useAuth();
  const location = useLocation();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-3xl font-bold text-gray-900">
            Social Relvant
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/instagram"
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                location.pathname === '/instagram'
                  ? 'bg-pink-50 text-pink-700'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Instagram className="w-5 h-5" />
              <span>Instagram</span>
            </Link>
            <Link
              to="/youtube"
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                location.pathname === '/youtube'
                  ? 'bg-red-50 text-red-700'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Youtube className="w-5 h-5" />
              <span>YouTube</span>
            </Link>
            <Link
              to="/favorites"
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                location.pathname === '/favorites'
                  ? 'bg-yellow-50 text-yellow-700'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Star className="w-5 h-5" />
              <span>Favorites</span>
            </Link>
            <ProfileDropdown />
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Sign out"
            >
              <LogOut size={20} />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}