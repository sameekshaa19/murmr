// src/utils/theme.js

export const COLORS = {
  // Primary Color Palette
  primary: '#F0E491',      // Soft warm yellow
  secondary: '#BBC863',    // Olive green
  accent: '#658C58',       // Forest green
  dark: '#31694E',         // Deep green
  
  // Neutral Colors
  background: '#FAFAF5',   // Off-white background
  white: '#FFFFFF',
  black: '#000000',
  
  // Semantic Colors
  gray: '#E0E0E0',
  lightGray: '#F5F5F5',
  darkGray: '#757575',
  error: '#E57373',
  success: '#81C784',
  warning: '#FFB74D',
  info: '#64B5F6',
  
  // Opacity variants
  primaryLight: 'rgba(240, 228, 145, 0.2)',
  accentLight: 'rgba(101, 140, 88, 0.1)',
  darkLight: 'rgba(49, 105, 78, 0.05)',
};

export const FONTS = {
  // Poppins (Primary)
  regular: 'Poppins-Regular',
  bold: 'Poppins-Bold',
  
  // Montserrat (Secondary)
  labelRegular: 'Montserrat-Regular',
  labelBold: 'Montserrat-SemiBold',
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 999,
};

export const SHADOWS = {
  soft: {
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  medium: {
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  strong: {
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const ANIMATIONS = {
  spring: {
    damping: 20,
    stiffness: 300,
  },
  timing: {
    duration: 300,
  },
};

// Common component styles
export const COMMON_STYLES = {
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.soft,
  },
  button: {
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  input: {
    height: 48,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
};

export default {
  COLORS,
  FONTS,
  FONT_SIZES,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  ANIMATIONS,
  COMMON_STYLES,
};