import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell } from 'lucide-react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';

const { width } = Dimensions.get('window');
const HEIGHT = width * 1.25; // 4:5 aspect ratio

const HeroSection = ({ shows, onShowPress }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  // Take top 5 shows for the carousel
  const carouselData = (shows || []).slice(0, 5);

  if (carouselData.length === 0) return null;

  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    if (roundIndex !== activeIndex) {
      setActiveIndex(roundIndex);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {carouselData.map((show, index) => (
          <HeroSlide key={show.id} show={show} onPress={() => onShowPress(show)} />
        ))}
      </ScrollView>

      {/* Dots Indicator */}
      {carouselData.length > 1 && (
        <View style={styles.pagination}>
          {carouselData.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === activeIndex ? styles.activeDot : styles.inactiveDot
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const HeroSlide = ({ show, onPress }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(show.releaseDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(show.releaseDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [show.releaseDate]);

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.slide}>
      <Image source={{ uri: show.image }} style={styles.image} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.9)']}
        style={styles.gradient}
      />

      <View style={styles.content}>
        <View style={styles.spotlightBadge}>
          <Text style={styles.spotlightText}>Upcoming Spotlight</Text>
        </View>

        <Text style={styles.title} numberOfLines={2}>{show.title}</Text>
        <Text style={styles.episode}>{show.episode}</Text>

        <View style={styles.bottomRow}>
          {/* Timer Box */}
          <View style={styles.timerBox}>
            <Text style={styles.timerLabel}>Releases In</Text>
            <Text style={[styles.timerValue, timeLeft.total <= 0 && styles.timerLive]}>
              {formatTimer(timeLeft)}
            </Text>
          </View>

          {/* Notify Button */}
          <TouchableOpacity style={styles.notifyButton}>
            <Bell size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Utilities (Same as ShowCard essentially)
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

const formatTimer = (timeLeft) => {
  if (timeLeft.total <= 0) return "LIVE NOW";
  const pad = (n) => n.toString().padStart(2, '0');
  return `${timeLeft.days}d ${pad(timeLeft.hours)}h ${pad(timeLeft.minutes)}m ${pad(timeLeft.seconds)}s`;
};

const styles = StyleSheet.create({
  container: {
    height: HEIGHT,
    width: width,
    marginBottom: SPACING.xl,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: width,
    height: HEIGHT,
    overflow: 'hidden', // Clip the bottom of the taller image
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 2/3, // Force poster aspect ratio (taller than container)
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.xl,
    paddingBottom: SPACING.xxl, // Extra padding for tab bar/dots
  },
  spotlightBadge: {
    backgroundColor: '#FFF',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: SPACING.sm,
  },
  spotlightText: {
    color: '#000',
    fontSize: 10,
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    color: '#FFF',
    fontSize: 32,
    fontFamily: FONTS.extraBold,
    lineHeight: 36,
    marginBottom: 4,
  },
  episode: {
    color: '#818cf8', // indigo-400
    fontSize: 14,
    fontFamily: FONTS.medium,
    marginBottom: SPACING.md,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  timerBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  timerLabel: {
    color: '#9CA3AF', // gray-400
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: FONTS.medium,
    marginBottom: 2,
  },
  timerValue: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'monospace', // Use system monospace
    fontWeight: '700',
  },
  timerLive: {
    color: '#4ade80', // green-400
  },
  notifyButton: {
    backgroundColor: COLORS.brand.primary,
    padding: 14,
    borderRadius: 50,
    shadowColor: COLORS.brand.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  pagination: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFF',
  },
  activeDot: {
    width: 12,
  },
  inactiveDot: {
    width: 6,
    opacity: 0.4,
  }
});

export default HeroSection;
