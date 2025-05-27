import React from 'react';
import { Star, Youtube, Instagram } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Favorite {
  id: string;
  platform: 'instagram' | 'youtube';
  profile_username: string;
  profile_name: string | null;
  profile_picture: string | null;
  created_at: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = React.useState<Favorite[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedPlatform, setSelectedPlatform] = React.useState<'all' | 'instagram' | 'youtube'>('all');
  const navigate = useNavigate();

  React.useEffect(() => {
    loadFavorites();
  }, []);

  async function loadFavorites() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) {
        setFavorites(data as Favorite[]);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  }

  async function removeFavorite(platform: string, username: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('platform', platform)
        .eq('profile_username', username);

      setFavorites(prev => prev.filter(f => 
        !(f.platform === platform && f.profile_username === username)
      ));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  }

  const navigateToProfile = (favorite: Favorite) => {
    // Save the username in localStorage to trigger the search
    // Remove @ for YouTube usernames
    const username = favorite.platform === 'youtube' && favorite.profile_username.startsWith('@') 
      ? favorite.profile_username.slice(1) 
      : favorite.profile_username;
    
    localStorage.setItem(`${favorite.platform}_last_search`, username);
    // Navigate to the corresponding platform page
    navigate(`/${favorite.platform}`);
  };

  const filteredFavorites = favorites.filter(favorite => 
    selectedPlatform === 'all' || favorite.platform === selectedPlatform
  );

  const getPlatformIcon = (platform: 'instagram' | 'youtube') => {
    return platform === 'youtube' ? (
      <Youtube className="w-5 h-5 text-red-600" />
    ) : (
      <Instagram className="w-5 h-5 text-pink-600" />
    );
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!favorites.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No favorite profiles yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Star className="w-6 h-6 text-yellow-500" />
          <h1 className="text-2xl font-bold text-gray-900">Favorite Profiles</h1>
        </div>

        <select
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value as 'all' | 'instagram' | 'youtube')}
          className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="all">All Platforms</option>
          <option value="instagram">Instagram</option>
          <option value="youtube">YouTube</option>
        </select>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredFavorites.map((favorite) => (
          <div
            key={favorite.id}
            className="bg-white rounded-lg shadow p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => navigateToProfile(favorite)}
          >
            {favorite.profile_picture ? (
              <img
                src={favorite.profile_picture}
                alt={favorite.profile_username}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <Star className="w-6 h-6 text-gray-400" />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {getPlatformIcon(favorite.platform)}
                <h4 className="font-medium text-gray-900 truncate">
                  {favorite.profile_name || favorite.profile_username}
                </h4>
              </div>
              <p className="text-sm text-gray-500">
                {favorite.profile_username}
              </p>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFavorite(favorite.platform, favorite.profile_username);
              }}
              className="text-yellow-500 hover:text-yellow-600"
            >
              <Star className="w-5 h-5" fill="currentColor" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}