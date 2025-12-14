import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { COLORS, FONTS, SPACING } from '../constants/theme';

const filters = [
  { id: 'all', label: 'All' },
  { id: 'drama', label: 'Dramas' },
  { id: 'movie', label: 'Movies' },
  { id: 'webseries', label: 'Web Series' },
];

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CategoryFilter = ({ activeFilter, onSelect }) => {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filters.map((filter) => {
          const isActive = activeFilter === filter.id;
          
          if (isActive) {
             return (
              <TouchableOpacity
                key={filter.id}
                onPress={() => onSelect(filter.id)}
                style={[styles.pill, styles.activePill]}
                activeOpacity={0.8}
              >
                <Text style={[styles.text, styles.activeText]}>{filter.label}</Text>
              </TouchableOpacity>
            );
          }

          return (
            <BlurView 
              key={filter.id} 
              intensity={20} 
              tint="light" 
              style={styles.pillContainer}
            >
              <TouchableOpacity
                onPress={() => onSelect(filter.id)}
                style={styles.pill}
                activeOpacity={0.8}
              >
                <Text style={styles.text}>{filter.label}</Text>
              </TouchableOpacity>
            </BlurView>
          );
        })}
      </ScrollView>
    </View>
  );
};
import { View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    // position: 'relative', // Default
    height: 50,
    marginBottom: SPACING.md, // Add some breathing room before Hero
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  pillContainer: {
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  pill: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 999,
  },
  activePill: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  text: {
    color: '#D1D5DB',
    fontFamily: FONTS.semiBold,
    fontSize: 14,
  },
  activeText: {
    color: '#000',
  },
});

export default CategoryFilter;
