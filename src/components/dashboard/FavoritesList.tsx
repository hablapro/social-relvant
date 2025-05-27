import React from 'react';
import { Star, ExternalLink, Youtube, Instagram } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { formatDate } from '../../utils/date';

interface Favorite {
  id: string;
  platform: 'youtube' | 'instagram';
  content_id: string;
  title: string;
  thumbnail: string;
  created_at: string;
}

export default function FavoritesList() {
  const [favorites, setFavorites] = React.useState<Favorite[]>([]);
  const [loading, setLoading] = React.useState(true);

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

  async function removeFavorite(id: string) {
    try {
      await supabase
        .from('favorites')
        .delete()
        .eq('id', id);

      setFavorites(prev => prev.filter(f => f.id !== id));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  }

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
        <p>No favorites yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {favorites.map((favorite) => (
        <div
          key={favorite.id}
          className="bg-white rounded-lg shadow p-4 flex items-center gap-4"
        >
          <div className="flex-shrink-0">
            {favorite.platform === 'youtube' ? (
              <Youtube className="w-6 h-6 text-red-600" />
            ) : (
              <Instagram className="w-6 h-6 text-pink-600" />
            )}
          </div>
          <img
            src={favorite.thumbnail}
            alt={favorite.title}
            className="w-32 h-20 object-cover rounded"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 truncate">{favorite.title}</h4>
            <p className="text-sm text-gray-500">
              Added on {formatDate(favorite.created_at)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={
                favorite.platform === 'youtube'
                  ? `https://www.youtube.com/watch?v=${favorite.content_id}`
                  : `https://www.instagram.com/p/${favorite.content_id}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className={`${
                favorite.platform === 'youtube' ? 'text-red-600' : 'text-pink-600'
              } hover:opacity-75`}
            >
              <ExternalLink className="w-5 h-5" />
            </a>
            <button
              onClick={() => removeFavorite(favorite.id)}
              className="text-yellow-500 hover:text-yellow-600"
            >
              <Star className="w-5 h-5" fill="currentColor" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}