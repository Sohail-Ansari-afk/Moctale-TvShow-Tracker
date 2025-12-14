import { supabase } from '../lib/supabase';
import { mapTMDBToAppSchema } from '../utils/mapper';

/**
 * Service to handle Watchlist and Content Caching interactions with Supabase
 */
export const ContentService = {
  
  /**
   * Fetches the user's watchlist with full content details
   */
  async getWatchlist(userId) {
    if (!userId) return [];
    
    // Join watchlist with contents
    const { data, error } = await supabase
      .from('watchlist')
      .select(`
        added_at,
        content:contents (*)
      `)
      .eq('user_id', userId)
      .order('added_at', { ascending: false });

    if (error) {
      console.error('Error fetching watchlist:', error);
      return [];
    }

    // Map DB content back to App Schema
    // The DB structure mimics the App Schema but flat.
    // mapTMDBToAppSchema handles TMDB raw data -> App Schema.
    // Here we need DB Schema -> App Schema.
    // Since we store it flat, it's mostly 1:1, but we need to ensure the format matches what components expect.
    
    return data.map(item => ({
      id: item.content.tmdb_id, // App uses TMDB ID as key
      title: item.content.title,
      type: item.content.media_type,
      image: item.content.poster_path, // Full URL stored? or just path? Let's check upsert.
                                       // Schema has 'poster_path'. We should store full URL or reconstructed?
                                       // Best to store partial if consistent, but for cache simplicity, storing what we use is easier.
      description: item.content.overview,
      releaseDate: item.content.release_date && item.content.release_date.length === 10 
        ? `${item.content.release_date}T20:00:00Z` 
        : item.content.release_date,
      // Reconstruct fields that might be missing or different
      rating: item.content.rating_average,
      
      // We might lose 'next_episode_to_air' specific logic unless we store it.
      // For now, let's treat cached content as "static snapshot".
      // Ideally, we'd refresh this from TMDB occasionally. 
    }));
  },

  /**
   * Adds a show to the watchlist, ensuring it exists in the Content cache first.
   */
  async addToWatchlist(userId, show) {
    if (!userId || !show) return false;

    try {
      // 1. Upsert Content
      // We need to map App Schema 'show' -> DB Schema 'contents'
      const contentData = {
        tmdb_id: show.id,
        media_type: show.type || 'movie',
        title: show.title,
        poster_path: show.image, // Note: App Schema 'image' is full URL usually depending on mapper.
                                 // If it's a full URL from mapTMDBToAppSchema, we store it as is for simplicity.
        overview: show.description,
        release_date: show.rawDate ? show.rawDate.split('T')[0] : null, // Extract YYYY-MM-DD from ISO
        // rating_average: we don't have this in simple Show object? 
        // If show object comes from DetailModal/Mapper, it might be missing rating if we didn't map it.
        // Let's rely on what we have.
      };

      const { data: contentRecord, error: contentError } = await supabase
        .from('contents')
        .upsert(contentData, { onConflict: 'tmdb_id, media_type' })
        .select()
        .single();
        
      if (contentError) throw contentError;

      // 2. Insert into Watchlist
      const { error: watchError } = await supabase
        .from('watchlist')
        .insert({
          user_id: userId,
          content_id: contentRecord.id
        });

      if (watchError) {
        // Ignore duplicate key error (already saved)
        if (watchError.code === '23505') return true;
        throw watchError;
      }

      return true;
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      return false;
    }
  },

  /**
   * Removes a show from the watchlist
   */
  async removeFromWatchlist(userId, tmdbId) {
    if (!userId || !tmdbId) return false;

    try {
      // We need to find the content_id for this tmdb_id to match the relation, 
      // OR we can use a subquery/join delete, but Supabase simple client implies finding ID is safer.
      // Actually, we can delete based on join? No.
      // Let's find the content ID first.
      
      const { data: content } = await supabase
        .from('contents')
        .select('id')
        .eq('tmdb_id', tmdbId)
        .single();

      if (!content) return false; // Content not found, so can't be in watchlist

      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('user_id', userId)
        .eq('content_id', content.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      return false;
    }
  }
};
