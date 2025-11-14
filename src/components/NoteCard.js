// src/components/NoteCard.js

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../utils/theme';
import { formatDate, formatDuration, hapticLight, hapticMedium, showConfirmAlert } from '../utils/helpers';
import { TAG_TYPES, MOODS } from '../utils/constants';

const NoteCard = ({ note, onPress, onDelete, onPlay }) => {
  const getTagIcon = () => {
    switch (note.tagType) {
      case TAG_TYPES.LOCATION:
        return '📍';
      case TAG_TYPES.TIME:
        return '⏰';
      case TAG_TYPES.MOOD:
        return note.tagValue.moodEmoji || '😌';
      default:
        return '🎙️';
    }
  };

  const getTagLabel = () => {
    switch (note.tagType) {
      case TAG_TYPES.LOCATION:
        return note.tagValue.address || 'Location reminder';
      case TAG_TYPES.TIME:
        return new Date(note.tagValue.timestamp).toLocaleString();
      case TAG_TYPES.MOOD:
        return note.tagValue.moodLabel || 'Mood reminder';
      default:
        return 'Reminder';
    }
  };

  const getTagColor = () => {
    switch (note.tagType) {
      case TAG_TYPES.LOCATION:
        return COLORS.accent;
      case TAG_TYPES.TIME:
        return COLORS.secondary;
      case TAG_TYPES.MOOD:
        const mood = MOODS.find(m => m.id === note.tagValue.moodId);
        return mood?.color || COLORS.primary;
      default:
        return COLORS.dark;
    }
  };

  const handleDelete = () => {
    hapticMedium();
    showConfirmAlert(
      'Delete Note',
      'Are you sure you want to delete this voice note?',
      () => onDelete(note),
      () => {}
    );
  };

  const handlePlay = () => {
    hapticLight();
    onPlay(note);
  };

  const handlePress = () => {
    hapticLight();
    onPress(note);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.container}
      activeOpacity={0.9}
    >
      <View style={styles.content}>
        {/* Icon and Type Indicator */}
        <View style={[styles.iconContainer, { backgroundColor: getTagColor() }]}>
          <Text style={styles.icon}>{getTagIcon()}</Text>
        </View>

        {/* Note Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {note.title || 'Voice Note'}
          </Text>
          
          <Text style={styles.tagLabel} numberOfLines={1}>
            {getTagLabel()}
          </Text>

          <View style={styles.metaContainer}>
            <Text style={styles.duration}>
              {formatDuration(note.duration)}
            </Text>
            <Text style={styles.separator}>•</Text>
            <Text style={styles.date}>
              {formatDate(note.createdAt)}
            </Text>
          </View>

          {note.isTriggered && (
            <View style={styles.triggeredBadge}>
              <Text style={styles.triggeredText}>✓ Played</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={handlePlay}
            style={[styles.actionButton, styles.playButton]}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>▶</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDelete}
            style={[styles.actionButton, styles.deleteButton]}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.soft,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  icon: {
    fontSize: 28,
  },
  detailsContainer: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.bold,
    color: COLORS.dark,
    marginBottom: SPACING.xs,
  },
  tagLabel: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.darkGray,
    marginBottom: SPACING.xs,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  duration: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONTS.labelRegular,
    color: COLORS.accent,
  },
  separator: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray,
    marginHorizontal: SPACING.xs,
  },
  date: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONTS.labelRegular,
    color: COLORS.darkGray,
  },
  triggeredBadge: {
    marginTop: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    backgroundColor: COLORS.success,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
  },
  triggeredText: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONTS.labelBold,
    color: COLORS.white,
  },
  actionsContainer: {
    gap: SPACING.xs,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: COLORS.accent,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
  },
  actionIcon: {
    fontSize: FONT_SIZES.md,
  },
});

export default NoteCard;