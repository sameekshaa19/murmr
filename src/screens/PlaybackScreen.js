// src/screens/PlaybackScreen.js

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../utils/theme';
import { formatDate, formatDuration, hapticMedium } from '../utils/helpers';
import { TAG_TYPES } from '../utils/constants';
import AudioPlayer from '../components/AudioPlayer';
import { useNotes } from '../context/NotesContext';

const PlaybackScreen = ({ route, navigation }) => {
  const { note } = route.params;
  const { deleteNote } = useNotes();

  const getTagDetails = () => {
    switch (note.tagType) {
      case TAG_TYPES.LOCATION:
        return {
          icon: '📍',
          label: 'Location Reminder',
          value: note.tagValue.address || 'Unknown location',
          color: COLORS.accent,
        };
      case TAG_TYPES.TIME:
        return {
          icon: '⏰',
          label: 'Time Reminder',
          value: new Date(note.tagValue.timestamp).toLocaleString(),
          color: COLORS.secondary,
        };
      case TAG_TYPES.MOOD:
        return {
          icon: note.tagValue.moodEmoji,
          label: 'Mood Reminder',
          value: note.tagValue.moodLabel,
          color: COLORS.primary,
        };
      default:
        return {
          icon: '🎙️',
          label: 'Voice Note',
          value: '',
          color: COLORS.dark,
        };
    }
  };

  const tagDetails = getTagDetails();

  const handleDelete = async () => {
    hapticMedium();
    await deleteNote(note._id, note.audioUri);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Card */}
      <View style={[styles.headerCard, { backgroundColor: tagDetails.color }]}>
        <Text style={styles.headerIcon}>{tagDetails.icon}</Text>
        <Text style={styles.headerTitle}>
          {note.title || 'Voice Note'}
        </Text>
        <Text style={styles.headerSubtitle}>{tagDetails.label}</Text>
      </View>

      {/* Audio Player */}
      <View style={styles.playerContainer}>
        <AudioPlayer audioUri={note.audioUri} />
      </View>

      {/* Details Card */}
      <View style={styles.detailsCard}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Tag</Text>
          <Text style={styles.detailValue}>{tagDetails.value}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Duration</Text>
          <Text style={styles.detailValue}>{formatDuration(note.duration)}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Created</Text>
          <Text style={styles.detailValue}>{formatDate(note.createdAt)}</Text>
        </View>

        {note.isTriggered && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Last Played</Text>
            <Text style={styles.detailValue}>{formatDate(note.triggeredAt)}</Text>
          </View>
        )}
      </View>

      {/* Delete Button */}
      <TouchableOpacity
        onPress={handleDelete}
        style={styles.deleteButton}
        activeOpacity={0.8}
      >
        <Text style={styles.deleteButtonText}>Delete Note</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
  },
  headerCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  headerIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.regular,
    color: COLORS.white,
    opacity: 0.9,
  },
  playerContainer: {
    marginBottom: SPACING.lg,
  },
  detailsCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.soft,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  detailLabel: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.labelBold,
    color: COLORS.darkGray,
  },
  detailValue: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.regular,
    color: COLORS.dark,
    flex: 1,
    textAlign: 'right',
    marginLeft: SPACING.md,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  deleteButtonText: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
});

export default PlaybackScreen;