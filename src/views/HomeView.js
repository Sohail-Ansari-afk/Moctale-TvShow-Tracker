import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HeroSection from '../components/HeroSection';
import ContentGrid from '../components/ContentGrid';
import CategoryFilter from '../components/CategoryFilter';
import { COLORS, FONTS, SPACING } from '../constants/theme';

const HomeView = ({ shows, onOpenDetail }) => {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredShows = activeFilter === 'all' 
    ? shows 
    : shows.filter(s => s.type === activeFilter);
  
  const heroShow = filteredShows[0];
  const gridShows = filteredShows; // HTML version includes hero in grid if filtered, but let's keep it simple.
  
  // HTML logic: Hero is the first item of filtered list. Grid shows ALL filtered items (including the one in hero? 
  // actually HTML renderGrid just renders mapped data. renderHero renders the first one. so yes duplicate. 
  // but usually app logic hides hero item from grid. Let's keep it consistent with typical apps: 
  // If 'all', show hero + grid. If filter, maybe just grid? 
  // Let's stick to HTML behavior: renderHero(filtered[0]), renderGrid(filtered).
  
  return (
    <View style={styles.container}>
      {/* ScrollView for content */}
      <ScrollView 
        contentContainerStyle={{ 
          paddingBottom: 100, 
          paddingTop: 0 // Allow Hero to bleed to top behind absolute header
        }}
        showsVerticalScrollIndicator={false}
      >
        <HeroSection 
          shows={filteredShows} 
          onShowPress={onOpenDetail}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending Now</Text>
          <Text style={styles.viewAll}>View All</Text>
        </View>

        <ContentGrid 
          data={gridShows} 
          onCardPress={onOpenDetail} 
        />
      </ScrollView>

      {/* Absolute Filters Overlay */}
      <View style={[styles.filterContainer, { top: insets.top + 60 }]}>
        <CategoryFilter 
          activeFilter={activeFilter} 
          onSelect={setActiveFilter} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.brand.bg,
  },
  filterContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
    // Background is transparent by default
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  viewAll: {
    color: COLORS.brand.primary, // indigo-400
    fontSize: 12,
    fontFamily: FONTS.semiBold,
  },
});

export default HomeView;
