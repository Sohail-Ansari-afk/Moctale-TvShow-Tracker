import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Home, Compass, Bookmark, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../constants/theme';

const TabBar = ({ activeTab, onSwitch, onSearch }) => {
  const insets = useSafeAreaInsets();

  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'explore', icon: Compass, label: 'Explore', action: onSearch },
    { id: 'saved', icon: Bookmark, label: 'Saved' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <BlurView intensity={80} tint="dark" style={[styles.container, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      <View style={styles.tabContainer}>
        {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            
            return (
              <TouchableOpacity
                key={tab.id}
                style={styles.tab}
                onPress={() => tab.action ? tab.action() : onSwitch(tab.id)}
                activeOpacity={0.8}
              >
                <Icon 
                  size={24} 
                  color={isActive ? COLORS.brand.primary : COLORS.text.secondary} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <Text style={[styles.label, { color: isActive ? COLORS.brand.primary : COLORS.text.secondary }]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
        })}
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  tabContainer: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 4,
  },
  label: {
    fontSize: 10,
    fontFamily: FONTS.medium,
  },
});

export default TabBar;
