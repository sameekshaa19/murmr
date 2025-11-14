// src/components/TagSelector.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../utils/theme';
import { TAG_TYPES } from '../utils/constants';
import { hapticLight } from '../utils/helpers';

const TAG_OPTIONS = [
  {
    type: TAG_TYPES.LOCATION,
    label: 'Location',
    icon: '📍',
    description: 'Remind me at a place',
    color: COLORS.accent,
  },
  {
    type: TAG_TYPES.TIME,
    label: 'Time',
    icon: '⏰',
    description: 'Remind me at a time',
    color: COLORS.secondary,
  },
  {
    type: TAG_TYPES.MOOD,
    label: 'Mood',
    icon: '😌',
    description: 'Remind me by feeling',
    color: COLORS.primary,
  },
];

const TagSelector = ({ selectedTag, onSelectTag }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>How do you want to be reminded?</Text>

      <View style={styles.optionsContainer}>
        {TAG_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.type}
            onPress={() => {
              hapticLight();
              onSelectTag(option.type);
            }}
            style={[
              styles.option,
              selectedTag === option.type && styles.optionSelected,
              { borderColor: option.color },
            ]}
            activeOpacity={0.8}
          >
            <Text style={styles.icon}>{option.icon}</Text>
            <Text style={[styles.label, selectedTag === option.type && styles.labelSelected]}>
              {option.label}
            </Text>
            <Text style={styles.description}>{option.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.bold,
    color: COLORS.dark,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  optionsContainer: {
    gap: SPACING.md,
  },
  option: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    alignItems: 'center',
    // Continuing src/components/TagSelector.js

    borderWidth: 2,
    borderColor: COLORS.gray,
    ...SHADOWS.soft,
  },
  optionSelected: {
    backgroundColor: COLORS.accentLight,
    borderWidth: 3,
    ...SHADOWS.medium,
  },
  icon: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  label: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.bold,
    color: COLORS.dark,
    marginBottom: SPACING.xs,
  },
  labelSelected: {
    color: COLORS.accent,
  },
  description: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.labelRegular,
    color: COLORS.darkGray,
    textAlign: 'center',
  },
});

export default TagSelector;