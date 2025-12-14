import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, X } from 'lucide-react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import { searchMulti } from '../services/api';
import { mapTMDBToAppSchema, mergeAndSortContent } from '../utils/mapper';
import ShowCard from '../components/ShowCard';
// Debounce helper
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const ExploreView = ({ onOpenDetail }) => {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const rawData = await searchMulti(debouncedQuery);
        // Map raw TMDB data to our app schema
        // We pass empty array for existing shows as we are just formatting new ones
        const mappedData = mergeAndSortContent([], rawData); 
        setResults(mappedData);
      } catch (error) {
        console.error("Search failed", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <Text style={styles.headerTitle}>Explore</Text>
      
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Search size={20} color={COLORS.text.secondary} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search movies, shows..."
          placeholderTextColor={COLORS.text.tertiary}
          value={query}
          onChangeText={setQuery}
          autoFocus={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <X size={20} color={COLORS.text.secondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      <ScrollView 
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.brand.primary} />
          </View>
        ) : (
          <>
            {results.length > 0 ? (
              <View style={styles.grid}>
                {results.map((show) => (
                  <ShowCard 
                    key={show.id} 
                    show={show} 
                    onPress={() => onOpenDetail(show)} 
                  />
                ))}
              </View>
            ) : (
               debouncedQuery.length > 0 && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No results found for "{debouncedQuery}"</Text>
                </View>
              )
            )}
            
            {!debouncedQuery && (
               <View style={styles.emptyContainer}>
                 <Text style={styles.categoryTitle}>Discover</Text>
                 <Text style={styles.emptyText}>Search for your favorite movies and TV shows from around the world.</Text>
               </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.brand.bg,
    paddingHorizontal: SPACING.lg,
  },
  headerTitle: {
    fontSize: 28, // Matches Home/Saved titles? Actually Home has custom header. Saved has 24.
    fontFamily: FONTS.extraBold,
    color: '#FFF',
    marginBottom: SPACING.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    marginBottom: SPACING.xl,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    color: '#FFF',
    fontFamily: FONTS.medium,
    fontSize: 16,
  },
  content: {
    flexGrow: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  loadingContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  categoryTitle: {
    color: '#FFF',
    fontSize: 20,
    fontFamily: FONTS.bold,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    color: COLORS.text.secondary,
    fontFamily: FONTS.regular,
    fontSize: 16,
    textAlign: 'center',
    maxWidth: '80%',
    lineHeight: 24,
  },
});

export default ExploreView;
