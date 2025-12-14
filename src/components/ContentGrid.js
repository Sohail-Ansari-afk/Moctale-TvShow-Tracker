import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Frown } from 'lucide-react-native';
import ShowCard from './ShowCard';
import { COLORS, FONTS, SPACING } from '../constants/theme';

const ContentGrid = ({ data, onCardPress }) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Frown size={48} color={COLORS.text.secondary} style={{ opacity: 0.5 }} />
        <Text style={styles.emptyText}>No results found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 2-column grid layout */}
      <View style={styles.grid}>
        {data.map((show) => (
          <ShowCard 
            key={show.id} 
            show={show} 
            onPress={() => onCardPress(show)} 
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 100, // Space for bottom tab
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    color: COLORS.text.secondary,
    fontFamily: FONTS.medium,
    marginTop: SPACING.md,
  },
});

export default ContentGrid;
