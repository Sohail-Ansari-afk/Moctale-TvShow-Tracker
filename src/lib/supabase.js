import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mnwvkocbborithfokitt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ud3Zrb2NiYm9yaXRoZm9raXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2Njg1MDksImV4cCI6MjA4MTI0NDUwOX0.OMclhulBsLoC4-TSY0D5ANjdwKw9mx_VnvYYeFK4rvg'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
