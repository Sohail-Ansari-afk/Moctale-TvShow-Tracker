import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Modal, Dimensions, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Clock, Bell, Check, Plus } from 'lucide-react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import { NotificationService } from '../services/notificationService';

const { height } = Dimensions.get('window');

const calculateTimeLeft = (releaseDate) => {
  const difference = +new Date(releaseDate) - +new Date();
  let timeLeft = { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      total: difference
    };
  }
  return timeLeft;
};

const formatTimer = (timeLeft, type, releaseDate) => {
  if (!releaseDate) return "COMING SOON";
  
  if (timeLeft.total <= 0) {
    if (type === 'movie') return "LIVE NOW";
    return "STREAM NOW"; // Or "AIRED"
  }
  const pad = (n) => n.toString().padStart(2, '0');
  return `${timeLeft.days}d ${pad(timeLeft.hours)}h ${pad(timeLeft.minutes)}m ${pad(timeLeft.seconds)}s`;
};

const DetailModal = ({ visible, show, onClose, onToggleSave, isSaved }) => {
  if (!show) return null;

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(show.releaseDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(show.releaseDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [show.releaseDate]);

  const handleNotify = async () => {
    if (!show.releaseDate) {
      Alert.alert("Date Unknown", "We don't know when this airs yet, so we can't notify you.");
      return;
    }
    
    // Ensure we have a valid future date logic handled by service
    const success = await NotificationService.scheduleNotification(
      show.title, 
      `Get ready! ${show.title} starts in 10 minutes.`,
      show.releaseDate
    );

    if (success) {
      Alert.alert("Reminder Set", "You'll be notified 10 minutes before the show starts! ⏰");
    } else {
      Alert.alert("Notice", "This show has already aired or is starting right now.");
    }
  };

  const typeColor = COLORS.type[show.type] || COLORS.type.webseries;

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <ScrollView style={styles.scrollContainer} bounces={false}>
          {/* Image Header */}
          <View style={styles.imageHeader}>
            <Image source={{ uri: show.image }} style={styles.image} resizeMode="cover" />
            <LinearGradient
              colors={['transparent', COLORS.brand.bg]}
              style={styles.gradient}
            />
            
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <BlurView intensity={50} tint="dark" style={styles.closeBlur}>
                <X color="#FFF" size={24} />
              </BlurView>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Badges */}
            <View style={styles.badgeRow}>
              <View style={[styles.typeBadge, { backgroundColor: typeColor.bg }]}>
                <Text style={styles.typeText}>{show.type}</Text>
              </View>
              <View style={styles.hdBadge}>
                <Text style={styles.hdText}>HD</Text>
              </View>
            </View>

            <Text style={styles.title}>{show.title}</Text>
            <Text style={styles.episode}>{show.episode}</Text>

            {/* Timer Block */}
            <View style={styles.timerBlock}>
              <View>
                <Text style={styles.timerLabel}>RELEASES IN</Text>
                <Text style={styles.timerValue}>{formatTimer(timeLeft, show.type, show.releaseDate)}</Text>
              </View>
              <View style={styles.clockIcon}>
                <Clock color={COLORS.brand.primary} size={20} />
              </View>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>SYNOPSIS</Text>
              <Text style={styles.description}>{show.description}</Text>
            </View>

            {/* Buttons */}
            <TouchableOpacity 
              style={styles.primaryButton} 
              activeOpacity={0.9}
              onPress={handleNotify}
            >
              <Bell color="#FFF" size={20} />
              <Text style={styles.primaryButtonText}>Notify Me</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.secondaryButton, 
                isSaved && styles.savedButton
              ]} 
              activeOpacity={0.9}
              onPress={() => onToggleSave(show)}
            >
              {isSaved ? <Check color="#4ADE80" size={20} /> : <Plus color="#FFF" size={20} />}
              <Text style={[styles.secondaryButtonText, isSaved && styles.savedButtonText]}>
                {isSaved ? 'Saved to List' : 'Add to Watchlist'}
              </Text>
            </TouchableOpacity>

            {/* Bottom Padding */}
            <View style={{ height: 40 }} />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.brand.bg,
  },
  scrollContainer: {
    flex: 1,
  },
  imageHeader: {
    height: height * 0.55,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    borderRadius: 50,
    overflow: 'hidden',
  },
  closeBlur: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  content: {
    paddingHorizontal: SPACING.xl,
    marginTop: -80, // Overlap image
  },
  badgeRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  typeText: {
    color: '#FFF',
    fontSize: 10,
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
  },
  hdBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  hdText: {
    color: '#FFF',
    fontSize: 10,
    fontFamily: FONTS.bold,
  },
  title: {
    color: '#FFF',
    fontSize: 32,
    fontFamily: FONTS.extraBold,
    marginBottom: SPACING.xs,
  },
  episode: {
    color: '#818CF8',
    fontSize: 18,
    fontFamily: FONTS.medium,
    marginBottom: SPACING.xl,
  },
  timerBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(38, 38, 38, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  timerLabel: {
    color: COLORS.text.secondary,
    fontSize: 10,
    fontFamily: FONTS.bold,
    marginBottom: 4,
  },
  timerValue: {
    color: '#FFF',
    fontSize: 24,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  clockIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: FONTS.bold,
    opacity: 0.8,
    marginBottom: SPACING.sm,
  },
  description: {
    color: COLORS.text.secondary,
    fontSize: 14,
    fontFamily: FONTS.regular,
    lineHeight: 22,
  },
  primaryButton: {
    width: '100%',
    padding: SPACING.lg,
    backgroundColor: COLORS.brand.primary,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  secondaryButton: {
    width: '100%',
    padding: SPACING.lg,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  secondaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  savedButton: {
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    borderColor: 'rgba(74, 222, 128, 0.3)',
  },
  savedButtonText: {
    color: '#4ADE80',
  },
});

export default DetailModal;
