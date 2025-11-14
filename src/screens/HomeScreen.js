// src/screens/HomeScreen.js

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../utils/theme';
import { SCREENS } from '../utils/constants';
import { hapticMedium, hapticLight } from '../utils/helpers';
import { useNotes } from '../context/NotesContext';
import LoadingSpinner from '../components/LoadingSpinner';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { notes, loading, isInitialized, startBackgroundTracking } = useNotes();

  useEffect(() => {
    // Start background tracking when app opens
    if (isInitialized) {
      startBackgroundTracking();
    }
  }, [isInitialized]);

  if (!isInitialized || loading) {
    return <LoadingSpinner message="Initializing Murmr..." />;
  }

  const locationNotes = notes.filter(n => n.tagType === 'location').length;
  const timeNotes = notes.filter(n => n.tagType === 'time').length;
  const moodNotes = notes.filter(n => n.tagType === 'mood').length;

  const handleRecordPress = () => {
    hapticMedium();
    navigation.navigate(SCREENS.RECORD);
  };

  const handleViewNotesPress = () => {
    hapticLight();
    navigation.navigate(SCREENS.NOTES_LIST);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.dark} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>🌀 Murmr</Text>
        <Text style={styles.tagline}>Your voice, your reminders</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsCard}>
            <Text style={styles.statsNumber}>{notes.length}</Text>
            <Text style={styles.statsLabel}>Total Notes</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.miniStatCard, { backgroundColor: COLORS.accentLight }]}>
              <Text style={styles.miniStatIcon}>📍</Text>
              <Text style={styles.miniStatNumber}>{locationNotes}</Text>
              <Text style={styles.miniStatLabel}>Places</Text>
            </View>

            <View style={[styles.miniStatCard, { backgroundColor: COLORS.primaryLight }]}>
              <Text style={styles.miniStatIcon}>⏰</Text>
              <Text style={styles.miniStatNumber}>{timeNotes}</Text>
              <Text style={styles.miniStatLabel}>Times</Text>
            </View>

            <View style={[styles.miniStatCard, { backgroundColor: COLORS.darkLight }]}>
              <Text style={styles.miniStatIcon}>😌</Text>
              <Text style={styles.miniStatNumber}>{moodNotes}</Text>
              <Text style={styles.miniStatLabel}>Moods</Text>
            </View>
          </View>
        </View>

        {/* Main Action Button */}
        <TouchableOpacity
          onPress={handleRecordPress}
          style={styles.recordButton}
          activeOpacity={0.9}
        >
          <View style={styles.recordButtonContent}>
            <Text style={styles.recordIcon}>🎙️</Text>
            <Text style={styles.recordButtonText}>Record New Note</Text>
            <Text style={styles.recordButtonSubtext}>
              Tap to start recording
            </Text>
          </View>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity
            onPress={handleViewNotesPress}
            style={styles.quickActionCard}
            activeOpacity={0.8}
          >
            <View style={styles.quickActionIcon}>
              <Text style={styles.quickActionEmoji}>📝</Text>
            </View>
            <View style={styles.quickActionContent}>
              <Text style={styles.quickActionTitle}>My Notes</Text>
              <Text style={styles.quickActionSubtitle}>
                View and manage all your voice notes
              </Text>
            </View>
            <Text style={styles.quickActionArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionCard, styles.quickActionCardDisabled]}
            activeOpacity={0.8}
            disabled
          >
            <View style={styles.quickActionIcon}>
              <Text style={styles.quickActionEmoji}>⚙️</Text>
            </View>
            <View style={styles.quickActionContent}>
              <Text style={styles.quickActionTitle}>Settings</Text>
              <Text style={styles.quickActionSubtitle}>
                Coming soon
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>How Murmr Works</Text>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>🎤</Text>
            <Text style={styles.infoText}>
              Record short voice notes to remind yourself of anything
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>🏷️</Text>
            <Text style={styles.infoText}>
              Tag notes with locations, times, or moods
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>🔔</Text>
            <Text style={styles.infoText}>
              Get reminded when conditions match
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.dark,
    paddingTop: StatusBar.currentHeight + SPACING.xl || SPACING.xxl,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  logo: {
    fontSize: FONT_SIZES.xxxl,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  tagline: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.regular,
    color: COLORS.secondary,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  statsContainer: {
    padding: SPACING.lg,
  },
  statsCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  statsNumber: {
    fontSize: 56,
    fontFamily: FONTS.bold,
    color: COLORS.accent,
  },
  statsLabel: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.regular,
    color: COLORS.darkGray,
    marginTop: SPACING.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  miniStatCard: {
    flex: 1,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
  },
  miniStatIcon: {
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  miniStatNumber: {
    fontSize: FONT_SIZES.xl,
    fontFamily: FONTS.bold,
    color: COLORS.dark,
  },
  miniStatLabel: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONTS.labelRegular,
    color: COLORS.darkGray,
    marginTop: SPACING.xs,
  },
  recordButton: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    backgroundColor: COLORS.accent,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.strong,
  },
  recordButtonContent: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  recordIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  recordButtonText: {
    fontSize: FONT_SIZES.xl,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  recordButtonSubtext: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.white,
    opacity: 0.8,
  },
  quickActionsContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.bold,
    color: COLORS.dark,
    marginBottom: SPACING.md,
  },
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.soft,
  },
  quickActionCardDisabled: {
    opacity: 0.5,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  quickActionEmoji: {
    fontSize: 24,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.bold,
    color: COLORS.dark,
    marginBottom: SPACING.xs,
  },
  quickActionSubtitle: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.darkGray,
  },
  quickActionArrow: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.accent,
    fontFamily: FONTS.bold,
  },
  infoSection: {
    paddingHorizontal: SPACING.lg,
  },
  infoTitle: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.bold,
    color: COLORS.dark,
    marginBottom: SPACING.md,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.soft,
  },
  infoIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  infoText: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.dark,
    lineHeight: 20,
  },
});

export default HomeScreen;