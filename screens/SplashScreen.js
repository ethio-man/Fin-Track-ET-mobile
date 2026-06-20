import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
  // Animation values
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(30)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(20)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;

  // Floating particles
  const particle1Y = useRef(new Animated.Value(0)).current;
  const particle2Y = useRef(new Animated.Value(0)).current;
  const particle3Y = useRef(new Animated.Value(0)).current;
  const particle1Opacity = useRef(new Animated.Value(0.3)).current;
  const particle2Opacity = useRef(new Animated.Value(0.5)).current;
  const particle3Opacity = useRef(new Animated.Value(0.2)).current;

  // Chart line animation
  const chartOpacity = useRef(new Animated.Value(0)).current;
  const chartTranslateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    startFloatingAnimations();
    startEntranceSequence();
  }, []);

  const startFloatingAnimations = () => {
    const floatLoop = (animValue, duration, distance) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: -distance,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: distance,
            duration,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    floatLoop(particle1Y, 2800, 12);
    floatLoop(particle2Y, 3400, 18);
    floatLoop(particle3Y, 2200, 8);
  };

  const startEntranceSequence = () => {
    Animated.sequence([
      // Logo pop in with bounce
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 60,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Chart animation
      Animated.parallel([
        Animated.timing(chartOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(chartTranslateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      // Title slides in
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(titleTranslateY, {
          toValue: 0,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      // Subtitle
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(subtitleTranslateY, {
          toValue: 0,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      // Tagline
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      // Progress bar (not useNativeDriver since it uses width layout)
      Animated.delay(200),
    ]).start();

    // Progress bar animation (separate since it uses layout)
    setTimeout(() => {
      Animated.timing(progressWidth, {
        toValue: width * 0.6,
        duration: 1800,
        useNativeDriver: false,
      }).start(() => {
        if (onFinish) {
          setTimeout(onFinish, 400);
        }
      });
    }, 1800);
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient
        colors={['#0A1628', '#0D2E6B', '#1565C0', '#1976D2']}
        locations={[0, 0.3, 0.7, 1]}
        style={styles.gradient}
      >
        {/* Floating Particles */}
        <Animated.View
          style={[
            styles.particle,
            styles.particle1,
            { opacity: particle1Opacity, transform: [{ translateY: particle1Y }] },
          ]}
        />
        <Animated.View
          style={[
            styles.particle,
            styles.particle2,
            { opacity: particle2Opacity, transform: [{ translateY: particle2Y }] },
          ]}
        />
        <Animated.View
          style={[
            styles.particle,
            styles.particle3,
            { opacity: particle3Opacity, transform: [{ translateY: particle3Y }] },
          ]}
        />
        <Animated.View
          style={[
            styles.particle,
            styles.particle4,
            { opacity: particle1Opacity, transform: [{ translateY: particle2Y }] },
          ]}
        />
        <Animated.View
          style={[
            styles.particle,
            styles.particle5,
            { opacity: particle3Opacity, transform: [{ translateY: particle1Y }] },
          ]}
        />

        {/* Decorative Rings */}
        <View style={styles.ringOuter} />
        <View style={styles.ringMiddle} />

        {/* Content */}
        <View style={styles.content}>
          {/* Logo Container with Glow */}
          <Animated.View
            style={[
              styles.glowContainer,
              { opacity: glowOpacity },
            ]}
          >
            <Animated.View
              style={[
                styles.logoContainer,
                {
                  opacity: logoOpacity,
                  transform: [{ scale: logoScale }],
                },
              ]}
            >
              <Image
                source={require('../assets/fintrack_logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </Animated.View>
          </Animated.View>

          {/* Mini Chart Animation */}
          <Animated.View
            style={[
              styles.chartContainer,
              { opacity: chartOpacity, transform: [{ translateY: chartTranslateY }] },
            ]}
          >
            <View style={styles.chartBar1} />
            <View style={styles.chartBar2} />
            <View style={styles.chartBar3} />
            <View style={styles.chartBar4} />
            <View style={styles.chartBar5} />
          </Animated.View>

          {/* App Title */}
          <Animated.Text
            style={[
              styles.title,
              {
                opacity: titleOpacity,
                transform: [{ translateY: titleTranslateY }],
              },
            ]}
          >
            FinTrack
            <Text style={styles.titleAccent}> ET</Text>
          </Animated.Text>

          {/* Subtitle */}
          <Animated.Text
            style={[
              styles.subtitle,
              {
                opacity: subtitleOpacity,
                transform: [{ translateY: subtitleTranslateY }],
              },
            ]}
          >
            የኢትዮጵያ ፋይናንስ አስተዳደር
          </Animated.Text>

          {/* English tagline */}
          <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
            Smart Finance. Ethiopian Roots.
          </Animated.Text>

          {/* Divider with Birr symbol */}
          <Animated.View style={[styles.dividerRow, { opacity: taglineOpacity }]}>
            <View style={styles.dividerLine} />
            <Text style={styles.birrSymbol}>ብር</Text>
            <View style={styles.dividerLine} />
          </Animated.View>
        </View>

        {/* Bottom Progress */}
        <View style={styles.bottomSection}>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
          </View>
          <Text style={styles.loadingText}>Initializing...</Text>
          <Text style={styles.versionText}>v1.0.0</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 60,
  },

  // Floating particles
  particle: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: 'rgba(100, 181, 246, 0.4)',
  },
  particle1: {
    width: 80,
    height: 80,
    top: height * 0.05,
    left: -20,
  },
  particle2: {
    width: 120,
    height: 120,
    top: height * 0.15,
    right: -30,
    backgroundColor: 'rgba(129, 212, 250, 0.2)',
  },
  particle3: {
    width: 50,
    height: 50,
    bottom: height * 0.2,
    left: 30,
    backgroundColor: 'rgba(179, 229, 252, 0.35)',
  },
  particle4: {
    width: 70,
    height: 70,
    bottom: height * 0.35,
    right: 20,
    backgroundColor: 'rgba(100, 181, 246, 0.25)',
  },
  particle5: {
    width: 40,
    height: 40,
    top: height * 0.45,
    left: width * 0.15,
    backgroundColor: 'rgba(200, 230, 255, 0.3)',
  },

  // Decorative rings
  ringOuter: {
    position: 'absolute',
    width: 340,
    height: 340,
    borderRadius: 170,
    borderWidth: 1,
    borderColor: 'rgba(100, 181, 246, 0.15)',
    top: height * 0.12,
    alignSelf: 'center',
  },
  ringMiddle: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 1,
    borderColor: 'rgba(100, 181, 246, 0.1)',
    top: height * 0.16,
    alignSelf: 'center',
  },

  // Content
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  // Glow + Logo
  glowContainer: {
    shadowColor: '#64B5F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 20,
    marginBottom: 12,
  },
  logoContainer: {
    width: 130,
    height: 130,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  logo: {
    width: 120,
    height: 120,
  },

  // Chart bars
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 5,
    marginBottom: 22,
    height: 30,
  },
  chartBar1: {
    width: 8,
    height: 14,
    borderRadius: 4,
    backgroundColor: 'rgba(100, 200, 255, 0.5)',
  },
  chartBar2: {
    width: 8,
    height: 20,
    borderRadius: 4,
    backgroundColor: 'rgba(100, 200, 255, 0.65)',
  },
  chartBar3: {
    width: 8,
    height: 12,
    borderRadius: 4,
    backgroundColor: 'rgba(100, 200, 255, 0.5)',
  },
  chartBar4: {
    width: 8,
    height: 26,
    borderRadius: 4,
    backgroundColor: 'rgba(100, 200, 255, 0.8)',
  },
  chartBar5: {
    width: 8,
    height: 30,
    borderRadius: 4,
    backgroundColor: '#64B5F6',
  },

  // Text
  title: {
    fontSize: 44,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  titleAccent: {
    color: '#64B5F6',
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 8,
    fontWeight: '500',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 13,
    color: 'rgba(100, 181, 246, 0.9)',
    marginTop: 6,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    maxWidth: 60,
    backgroundColor: 'rgba(100, 181, 246, 0.4)',
  },
  birrSymbol: {
    color: '#64B5F6',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
  },

  // Bottom
  bottomSection: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 60,
  },
  progressTrack: {
    width: '100%',
    maxWidth: width * 0.6,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#64B5F6',
    borderRadius: 3,
  },
  loadingText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    marginTop: 10,
    letterSpacing: 1,
  },
  versionText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 10,
    marginTop: 4,
    letterSpacing: 0.5,
  },
});
