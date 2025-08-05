import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ScrollView,
  Animated,
  AccessibilityInfo,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils/constants';

const { width, height } = Dimensions.get('window');

interface LandingScreenProps {
  onGetStarted: () => void;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
  color: string;
  accessibilityLabel: string;
}

export default function LandingScreen({ onGetStarted }: LandingScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const autoScrollInterval = useRef<NodeJS.Timeout | null>(null);
  
  // Proper animation values in state
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const features: Feature[] = [
    {
      icon: 'compass',
      title: 'Discover Local Events',
      description: 'Find amazing events happening right around you, from live music to food festivals.',
      color: COLORS.primary,
      accessibilityLabel: 'Discover local events feature',
    },
    {
      icon: 'heart',
      title: 'Save What You Love',
      description: 'Build your personal collection of events and never miss out on what matters to you.',
      color: COLORS.error,
      accessibilityLabel: 'Save events feature',
    },
    {
      icon: 'people',
      title: 'Connect with Friends',
      description: 'See what your friends are interested in and discover events together.',
      color: COLORS.secondary,
      accessibilityLabel: 'Connect with friends feature',
    },
    {
      icon: 'map',
      title: 'Explore Your City',
      description: 'Visualize events on an interactive map and find hidden gems in your area.',
      color: COLORS.warning,
      accessibilityLabel: 'Explore city feature',
    },
  ];

  useEffect(() => {
    // Initialize animations
    const initializeAnimations = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsLoading(false);
      });
    };

    initializeAnimations();

    // Auto-scroll carousel
    autoScrollInterval.current = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = (prev + 1) % features.length;
        scrollToSlide(next);
        return next;
      });
    }, 4000);

    // Accessibility announcement
    AccessibilityInfo.announceForAccessibility('Welcome to Around Me Now. Discover amazing events near you.');

    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, []);

  const scrollToSlide = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * (width - SPACING.lg * 2),
      animated: true,
    });
  };

  const handleSlideChange = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const slideIndex = Math.round(contentOffset / (width - SPACING.lg * 2));
    setCurrentSlide(slideIndex);
  };

  const handleGetStarted = () => {
    console.log('🎯 Get Started button pressed!');
    console.log('📱 Navigating to user type selection...');
    
    // Navigate to user type selection
    onGetStarted();
  };

  const renderFeatureSlide = (feature: Feature, index: number) => {
    const isActive = index === currentSlide;
    return (
      <Animated.View
        key={index}
        style={[
          styles.slide,
          {
            opacity: isActive ? 1 : 0.6,
            transform: [{ scale: isActive ? 1 : 0.95 }],
          },
        ]}
        accessible={true}
        accessibilityLabel={feature.accessibilityLabel}
        accessibilityRole="button"
      >
        <View style={[styles.iconContainer, { backgroundColor: feature.color + '20' }]}>
          <Ionicons name={feature.icon as any} size={48} color={feature.color} />
        </View>
        <Text style={styles.slideTitle}>{feature.title}</Text>
        <Text style={styles.slideDescription}>{feature.description}</Text>
      </Animated.View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        <View style={styles.loadingContainer}>
          <Animated.View
            style={[
              styles.loadingContent,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Ionicons name="location" size={48} color={COLORS.primary} />
            <Text style={styles.loadingText}>Around Me Now</Text>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.logoContainer}>
          <Ionicons name="location" size={32} color={COLORS.white} />
          <Text style={styles.logoText}>Around Me Now</Text>
        </View>
        <Text style={styles.tagline}>Discover Your City's Hidden Gems</Text>
      </Animated.View>

      {/* Hero Section */}
      <Animated.View 
        style={[
          styles.heroSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.heroTitle}>
          Find Amazing Events
          <Text style={styles.heroTitleHighlight}> Near You</Text>
        </Text>
        <Text style={styles.heroSubtitle}>
          From live music to food festivals, discover what's happening in your city right now.
        </Text>
      </Animated.View>

      {/* Features Carousel */}
      <View style={styles.carouselContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          style={styles.carousel}
          contentContainerStyle={styles.carouselContent}
          onMomentumScrollEnd={handleSlideChange}
          decelerationRate="fast"
          snapToInterval={width - SPACING.lg * 2}
          snapToAlignment="center"
        >
          {features.map((feature, index) => renderFeatureSlide(feature, index))}
        </ScrollView>
        
        {/* Dots Indicator */}
        <View style={styles.dotsContainer}>
          {features.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dot,
                { backgroundColor: index === currentSlide ? COLORS.primary : COLORS.lightGray },
              ]}
              onPress={() => {
                setCurrentSlide(index);
                scrollToSlide(index);
              }}
              accessible={true}
              accessibilityLabel={`Go to slide ${index + 1}`}
              accessibilityRole="button"
            />
          ))}
        </View>
      </View>

      {/* Stats Section */}
      <Animated.View 
        style={[
          styles.statsContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>500+</Text>
          <Text style={styles.statLabel}>Events Daily</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>50K+</Text>
          <Text style={styles.statLabel}>Happy Users</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>100+</Text>
          <Text style={styles.statLabel}>Cities</Text>
        </View>
      </Animated.View>

      {/* CTA Section */}
      <Animated.View 
        style={[
          styles.ctaContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity 
          style={styles.ctaButton} 
          onPress={handleGetStarted}
          activeOpacity={0.8}
          accessible={true}
          accessibilityLabel="Get started with Around Me Now"
          accessibilityRole="button"
          accessibilityHint="Opens the app and takes you to user type selection"
        >
          <Text style={styles.ctaButtonText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
        </TouchableOpacity>
        
        <View style={styles.socialProof}>
          <Ionicons name="star" size={16} color={COLORS.warning} />
          <Text style={styles.socialProofText}>
            Join 50,000+ people discovering amazing events
          </Text>
        </View>
      </Animated.View>

      {/* Bottom Features */}
      <Animated.View 
        style={[
          styles.bottomFeatures,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.featureItem}>
          <Ionicons name="shield-checkmark" size={24} color={COLORS.success} />
          <Text style={styles.featureText}>Verified Events</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="time" size={24} color={COLORS.primary} />
          <Text style={styles.featureText}>Real-time Updates</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="wifi" size={24} color={COLORS.secondary} />
          <Text style={styles.featureText}>Offline Access</Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: SPACING.md,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginLeft: SPACING.sm,
  },
  tagline: {
    fontSize: 16,
    color: COLORS.white + 'CC',
    textAlign: 'center',
  },
  heroSection: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: Math.min(32, width * 0.08),
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: Math.min(38, width * 0.1),
    marginBottom: SPACING.md,
  },
  heroTitleHighlight: {
    color: COLORS.primary,
  },
  heroSubtitle: {
    fontSize: Math.min(18, width * 0.045),
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: Math.min(24, width * 0.06),
  },
  carouselContainer: {
    flex: 1,
    paddingVertical: SPACING.lg,
  },
  carousel: {
    flex: 1,
  },
  carouselContent: {
    paddingHorizontal: SPACING.lg,
  },
  slide: {
    width: width - SPACING.lg * 2,
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  iconContainer: {
    width: Math.min(80, width * 0.2),
    height: Math.min(80, width * 0.2),
    borderRadius: BORDER_RADIUS.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  slideTitle: {
    fontSize: Math.min(24, width * 0.06),
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  slideDescription: {
    fontSize: Math.min(16, width * 0.04),
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: Math.min(22, width * 0.055),
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.cardBackground,
    marginHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: Math.min(24, width * 0.06),
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: Math.min(14, width * 0.035),
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
  },
  ctaContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    alignItems: 'center',
  },
  ctaButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaButtonText: {
    fontSize: Math.min(18, width * 0.045),
    fontWeight: 'bold',
    color: COLORS.white,
    marginRight: SPACING.sm,
  },
  socialProof: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialProofText: {
    fontSize: Math.min(14, width * 0.035),
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  bottomFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureText: {
    fontSize: Math.min(12, width * 0.03),
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
}); 