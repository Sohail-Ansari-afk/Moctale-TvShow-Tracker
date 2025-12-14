import { supabase } from '../lib/supabase';

export const UserService = {
  /**
   * Fetch the full profile for a user
   */
  async getProfile(userId) {
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  },

  /**
   * Update profile fields
   */
  async updateProfile(userId, updates) {
    if (!userId) return null;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      return null;
    }
  }
};
