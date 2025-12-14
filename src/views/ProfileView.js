import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Camera, Bell, Download, Settings, HelpCircle, ChevronRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

const ProfileView = ({ savedCount, user, onSignOut }) => {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 80 }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={[COLORS.brand.primary, '#A855F7']} // indigo to purple
            style={styles.avatarGradient}
          >
            <View style={styles.avatarInner}>
               <Image 
                 source={{ uri: "https://api.dicebear.com/7.x/avataaars/png?seed=Felix" }} 
                 style={styles.avatar} 
               />
            </View>
          </LinearGradient>
          <TouchableOpacity style={styles.cameraBtn}>
            <Camera size={14} color={COLORS.brand.primary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>
          {user?.email ? user.email.split('@')[0] : "User"}
        </Text>
        <Text style={styles.membership}>{user?.email || "Member"}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: COLORS.brand.primary }]}>{savedCount}</Text>
          <Text style={styles.statLabel}>Saved</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: '#EC4899' }]}>12</Text>
          <Text style={styles.statLabel}>Watched</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: '#22C55E' }]}>4</Text>
          <Text style={styles.statLabel}>Reviews</Text>
        </View>
      </View>

      <View style={styles.menuGroup}>
        <MenuItem 
          icon={Bell} 
          color="indigo" 
          label="Notifications" 
          onPress={() => Alert.alert("Notifications", "You have no new notifications.")} 
        />
        <MenuItem 
          icon={Download} 
          color="pink" 
          label="Downloads" 
          last 
          onPress={() => Alert.alert("Downloads", "No active downloads found.")} 
        />
      </View>

      <View style={styles.menuGroup}>
        <MenuItem 
          icon={Settings} 
          color="green" 
          label="App Settings" 
          onPress={() => Alert.alert("Settings", "App Version: 1.0.0 (MVP)")} 
        />
        <MenuItem 
          icon={HelpCircle} 
          color="orange" 
          label="Help & Support" 
          last 
          onPress={() => Alert.alert("Support", "Contact us at support@moctale.com")} 
        />
      </View>

      <TouchableOpacity 
        style={styles.signOutBtn}
        onPress={() => Alert.alert("Sign Out", "Are you sure?", [
          { text: "Cancel", style: "cancel" },
          { text: "Sign Out", style: "destructive", onPress: onSignOut }
        ])}
      >
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Version 1.0.0 (MVP)</Text>
    </ScrollView>
  );
};

const MenuItem = ({ icon: Icon, color, label, last, onPress }) => {
  const colorMap = {
    indigo: { bg: 'rgba(99, 102, 241, 0.1)', text: '#818CF8' },
    pink: { bg: 'rgba(236, 72, 153, 0.1)', text: '#F472B6' },
    green: { bg: 'rgba(34, 197, 94, 0.1)', text: '#4ADE80' },
    orange: { bg: 'rgba(249, 115, 22, 0.1)', text: '#FB923C' },
  };
  const theme = colorMap[color];

  return (
    <TouchableOpacity 
      style={[styles.menuItem, !last && styles.borderBottom]}
      onPress={onPress}
    >
      <View style={styles.menuLeft}>
        <View style={[styles.iconBox, { backgroundColor: theme.bg }]}>
          <Icon size={20} color={theme.text} />
        </View>
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      <ChevronRight size={20} color={COLORS.text.tertiary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.brand.bg,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  avatarContainer: {
    marginBottom: SPACING.md,
    position: 'relative',
  },
  avatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    padding: 3,
  },
  avatarInner: {
    flex: 1,
    backgroundColor: COLORS.brand.surface,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: COLORS.brand.surface,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.brand.surface,
    padding: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  name: {
    color: '#FFF',
    fontSize: 24,
    fontFamily: FONTS.bold,
    marginBottom: 4,
  },
  membership: {
    color: COLORS.text.secondary,
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.brand.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statValue: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    marginBottom: 4,
  },
  statLabel: {
    color: COLORS.text.secondary,
    fontSize: 10,
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuGroup: {
    backgroundColor: COLORS.brand.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: SPACING.lg,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  iconBox: {
    padding: 8,
    borderRadius: 8,
  },
  menuLabel: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: FONTS.medium,
  },
  signOutBtn: {
    padding: SPACING.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)', // red-500
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  signOutText: {
    color: '#EF4444',
    fontFamily: FONTS.bold,
  },
  version: {
    textAlign: 'center',
    color: COLORS.text.tertiary,
    fontSize: 12,
    marginTop: SPACING.xl,
  },
});

export default ProfileView;
