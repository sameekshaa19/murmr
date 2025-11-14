// src/components/Header.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../utils/theme';
import { hapticLight } from '../utils/helpers';

const Header = ({ title, subtitle, onBackPress, rightAction }) => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.dark} />
      <View style={styles.container}>
        <View style={styles.content}>
          {onBackPress && (
            <TouchableOpacity
              onPress={() => {
                hapticLight();
                onBackPress();
              }}
              style={styles.backButton}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
          )}

          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>

          {rightAction && (
            <TouchableOpacity
              onPress={() => {
                hapticLight();
                rightAction.onPress();
              }}
              style={styles.rightButton}
            >
              <Text style={styles.rightText}>{rightAction.label}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.dark,
    paddingTop: SPACING.xl + 20,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 28,
    color: COLORS.primary,
    fontFamily: FONTS.bold,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.secondary,
    marginTop: SPACING.xs,
  },
  rightButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  rightText: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
});

export default Header;