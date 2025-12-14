import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Modal, StyleSheet, FlatList } from 'react-native';
import { ChevronLeft, Search } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING } from '../constants/theme';

const SearchModal = ({ visible, onClose, allShows, onSelect }) => {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  
  const results = query 
    ? allShows.filter(s => s.title.toLowerCase().includes(query.toLowerCase()))
    : allShows;

  const handleSelect = (show) => {
    onSelect(show);
    // Optional: clear query or close modal handled by parent
  };

  return (
    <Modal
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <ChevronLeft color="#FFF" size={28} />
          </TouchableOpacity>
          
          <View style={styles.searchBar}>
            <TextInput
              style={styles.input}
              placeholder="Search movies, shows..."
              placeholderTextColor={COLORS.text.tertiary}
              value={query}
              onChangeText={setQuery}
              autoFocus
            />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionHeader}>Top Results</Text>
          
          <FlatList
            data={results}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 40 }}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.resultItem} 
                onPress={() => handleSelect(item)}
              >
                <Image source={{ uri: item.image }} style={styles.poster} />
                <View style={styles.info}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.episode}>{item.episode}</Text>
                  <View style={styles.typeBadge}>
                     <Text style={styles.typeText}>{item.type}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.brand.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  backButton: {
    padding: 4,
  },
  searchBar: {
    flex: 1,
    backgroundColor: COLORS.brand.surfaceHighlight,
    borderRadius: 999,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 4,
  },
  input: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: FONTS.regular,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  sectionHeader: {
    color: COLORS.text.secondary,
    fontSize: 14,
    fontFamily: FONTS.medium,
    marginBottom: SPACING.md,
    marginTop: SPACING.md,
  },
  resultItem: {
    flexDirection: 'row',
    gap: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.brand.surfaceHighlight,
    borderRadius: 12,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  poster: {
    width: 60,
    height: 90,
    borderRadius: 6,
    backgroundColor: COLORS.brand.surface,
  },
  info: {
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: FONTS.bold,
    marginBottom: 4,
  },
  episode: {
    color: COLORS.text.secondary,
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginBottom: 8,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  typeText: {
    color: '#D1D5DB',
    fontSize: 10,
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
  },
});

export default SearchModal;
