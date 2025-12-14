import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bookmark, BookmarkPlus } from 'lucide-react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import ShowCard from '../components/ShowCard';

const SavedView = ({ savedShows, onShowPress, onExplorePress }) => {
  const insets = useSafeAreaInsets();
  const isEmpty = !savedShows || savedShows.length === 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      
      {/* Header - Only show if not empty? Or always show? Design implies always or conditional. Let's keep it clean. */}
      {!isEmpty && (
        <View style={styles.header}>
          <Bookmark size={24} color={COLORS.brand.primary} />
          <Text style={styles.headerTitle}>My Watchlist</Text>
        </View>
      )}

      {isEmpty ? (
        <View style={styles.emptyContainer}>
          <View style={styles.iconCircle}>
            <BookmarkPlus size={32} color={COLORS.text.tertiary} />
          </View>
          <Text style={styles.emptyTitle}>Your list is empty</Text>
          <Text style={styles.emptyText}>Track shows and movies you want to watch later.</Text>
          
          <TouchableOpacity onPress={onExplorePress} style={styles.exploreButton}>
            <Text style={styles.exploreButtonText}>Explore Content</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={[styles.grid, { paddingBottom: insets.bottom + 100 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.row}>
            {savedShows.map((show) => (
              <ShowCard 
                key={show.id} 
                show={show} 
                onPress={() => onShowPress(show)} 
              />
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.brand.bg,
    paddingHorizontal: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.text.primary,
  },
  grid: {
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100, // Offset visual center slightly up
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1f2937', // gray-800
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: FONTS.bold,
    marginBottom: 4,
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: FONTS.regular,
    textAlign: 'center',
    maxWidth: 200,
    lineHeight: 20,
  },
  exploreButton: {
    marginTop: SPACING.xxl,
    backgroundColor: COLORS.brand.primary,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: 12, // Increased touch area
    borderRadius: 50,
  },
  exploreButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: FONTS.bold,
  }
});

export default SavedView;
