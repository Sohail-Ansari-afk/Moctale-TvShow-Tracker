import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { 
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold 
} from '@expo-google-fonts/inter';

import Header from './src/components/Header';
import TabBar from './src/components/TabBar';
import DetailModal from './src/components/DetailModal';

import ExploreView from './src/views/ExploreView';
import HomeView from './src/views/HomeView';
import SavedView from './src/views/SavedView';
import ProfileView from './src/views/ProfileView';

// ... (existing imports)



import { supabase } from './src/lib/supabase';
import AuthView from './src/views/AuthView';

// ... (keep existing imports)

import { MOCK_SHOWS } from './src/constants/data';
import { COLORS } from './src/constants/theme';
import { fetchUpcomingMovies, fetchOnTheAirSeries, fetchAsianSeries } from './src/services/api';
import { mergeAndSortContent } from './src/utils/mapper';

import { ContentService } from './src/services/contentService'; // Sync service

export default function App() {
  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'Inter-ExtraBold': Inter_800ExtraBold,
  });

  const [activeTab, setActiveTab] = useState('home');
  // Store saved shows as a Map to preserve full object data (needed for Search results)
  const [savedShows, setSavedShows] = useState(new Map());
  const [detailShow, setDetailShow] = useState(null);
  
  const [shows, setShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Auth State
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserWatchlist(session.user.id);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserWatchlist(session.user.id);
      } else {
        setSavedShows(new Map()); // Clear on logout
      }
    });

    return () => subscription.unsubscribe();
  }, []);
  
  const fetchUserWatchlist = async (userId) => {
    const list = await ContentService.getWatchlist(userId);
    const map = new Map();
    list.forEach(item => map.set(item.id, item));
    setSavedShows(map);
  };
  
  // ...

  useEffect(() => {
    // ... loadData logic ...
    const loadData = async () => {
      try {
        const [movies, series, asianSeries] = await Promise.all([
          fetchUpcomingMovies(),
          fetchOnTheAirSeries(),
          fetchAsianSeries()
        ]);
        const combinedSeries = [...series, ...asianSeries]; 
        const uniqueSeries = Array.from(new Map(combinedSeries.map(item => [item.id, item])).values());
        
        const processed = mergeAndSortContent(movies, uniqueSeries);
        setShows(processed);
      } catch (e) {
        console.log("Failed to load content", e);
        setShows(MOCK_SHOWS);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const [_, setTick] = useState(0);

  const toggleSave = async (show) => {
    // Optimistic Update
    const newMap = new Map(savedShows);
    const exists = newMap.has(show.id);

    if (exists) {
      newMap.delete(show.id);
    } else {
      newMap.set(show.id, show);
    }
    setSavedShows(newMap);

    // Sync with Cloud if logged in
    if (session?.user) {
      if (exists) {
        await ContentService.removeFromWatchlist(session.user.id, show.id);
      } else {
        await ContentService.addToWatchlist(session.user.id, show);
      }
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeView 
            shows={shows.length > 0 ? shows : MOCK_SHOWS} 
            onOpenDetail={setDetailShow} 
          />
        );
      case 'explore':
        return <ExploreView onOpenDetail={setDetailShow} />;
      case 'saved':
        return (
          <SavedView 
            savedShows={Array.from(savedShows.values())} 
            onShowPress={setDetailShow}
            onExplorePress={() => setActiveTab('explore')}
          />
        );
      case 'profile':
        // If not logged in, show Auth Screen
        if (!session) {
          return <AuthView />;
        }
        return (
          <ProfileView 
            savedCount={savedShows.size} 
            user={session.user} // Pass user to profile
            onSignOut={() => supabase.auth.signOut()}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" />
        
        {activeTab !== 'saved' && activeTab !== 'profile' && activeTab !== 'explore' && (
           <Header 
             onSearch={() => setActiveTab('explore')} 
             onReset={() => setActiveTab('home')}
           />
        )}
        
        {renderContent()}

        <TabBar 
          activeTab={activeTab} 
          onSwitch={setActiveTab}
          onSearch={() => setActiveTab('explore')}
        />

        {/* Overlays */}
        <DetailModal 
          visible={!!detailShow}
          show={detailShow}
          onClose={() => setDetailShow(null)}
          isSaved={detailShow ? savedShows.has(detailShow.id) : false}
          onToggleSave={toggleSave}
        />


        
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.brand.bg,
  },
});
