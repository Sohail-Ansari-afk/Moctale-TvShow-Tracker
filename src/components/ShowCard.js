import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, Check } from 'lucide-react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';

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
  if (timeLeft.total <= 0) return "LIVE";
  const pad = (n) => n.toString().padStart(2, '0');
  if (timeLeft.days > 0) return `${timeLeft.days}d ${pad(timeLeft.hours)}h`;
  return `${pad(timeLeft.hours)}h ${pad(timeLeft.minutes)}m ${pad(timeLeft.seconds)}s`;
};

const ShowCard = ({ show, onPress }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(show.releaseDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(show.releaseDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [show.releaseDate]);

  const isMovie = show.type === 'movie';
  const isWebOrDrama = show.type === 'webseries' || show.type === 'drama';
  const isPast = timeLeft.total <= 0;
  
  // User Rule: "Keep it live now for the movies only"
  // For TV/Drama, we do NOT show "RELEASED" or "LIVE" badge.
  
  const showLiveBadge = isPast && isMovie; // STRICTLY movies only for "RELEASED"/"LIVE" badge

  const typeColor = COLORS.type[show.type] || COLORS.type.webseries;


  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: show.image }} style={styles.image} resizeMode="cover" />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)']}
          style={styles.gradient}
        />
        
        {/* Type Badge */}
        <View style={[styles.typeBadge, { backgroundColor: typeColor.bg, borderColor: typeColor.border }]}>
          <Text style={styles.typeText}>{show.type}</Text>
        </View>

        {/* Countdown - Show Timer if Future, or LIVE badge if active release. Hide if old. */}
        {/* Countdown / Status Badges */}
        {(show.isFinished) ? (
           <View style={styles.bottomContent}>
             <Text style={styles.episodeText} numberOfLines={1}>{show.episode}</Text>
             <View style={styles.completedBadge}>
               <Check size={10} color="#FFF" />
               <Text style={styles.timerText}>COMPLETED</Text>
             </View>
           </View>
        ) : (timeLeft.total > 0 || showLiveBadge) ? (
          <View style={styles.bottomContent}>
            <Text style={styles.episodeText} numberOfLines={1}>{show.episode}</Text>
            <View style={[styles.timerBadge, showLiveBadge && styles.timerLive]}>
              <Clock size={12} color="#FFF" />
              <Text style={styles.timerText}>
                {showLiveBadge ? "RELEASED" : formatTimer(timeLeft)}
              </Text>
            </View>
          </View>
        ) : null}
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{show.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%', // Approx 2 col grid
    marginBottom: SPACING.lg,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 2/3,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: COLORS.brand.surfaceHighlight,
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
  typeBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  typeText: {
    color: '#FFF',
    fontSize: 9,
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
  },
  bottomContent: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
  },
  episodeText: {
    color: '#D1D5DB', // gray-300
    fontSize: 10,
    marginBottom: 4,
    fontFamily: FONTS.medium,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    backgroundColor: 'rgba(99, 102, 241, 0.9)', // indigo-600
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    backgroundColor: 'rgba(107, 114, 128, 0.9)', // Gray
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(107, 114, 128, 0.3)',
  },
  timerLive: {
    backgroundColor: 'rgba(22, 163, 74, 0.9)', // green-600
    borderColor: 'rgba(22, 163, 74, 0.3)',
  },
  timerText: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'monospace', // Using system monospace for numbers
    fontWeight: 'bold',
  },
  info: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  title: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    lineHeight: 18,
  },
});

export default ShowCard;
