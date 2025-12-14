import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Clapperboard, Search } from 'lucide-react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';

const Header = ({ onSearch, onReset }) => {
  const insets = useSafeAreaInsets();

  return (
    <BlurView
      intensity={50}
      tint="dark"
      style={[styles.container, { paddingTop: insets.top + SPACING.sm }]}
    >
      <TouchableOpacity 
        style={styles.logoContainer} 
        activeOpacity={0.8}
        onPress={onReset}
      >
        <Clapperboard size={28} color={COLORS.brand.primary} />
        <Text style={styles.logoText}>
          Moc<Text style={{ color: COLORS.brand.primary }}>Tale</Text>
        </Text>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={onSearch}
          activeOpacity={0.8}
        >
          <Search size={20} color="#FFF" />
        </TouchableOpacity>
        
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>ME</Text>
        </View>
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  logoText: {
    color: '#FFF',
    fontSize: 20,
    fontFamily: FONTS.extraBold,
    letterSpacing: -1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  searchButton: {
    padding: 8,
    backgroundColor: COLORS.brand.surfaceHighlight,
    borderRadius: 50,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.brand.surface,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 10,
    fontFamily: FONTS.bold,
  },
});

export default Header;
