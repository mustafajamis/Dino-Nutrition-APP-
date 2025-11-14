import {Dimensions, StyleSheet} from 'react-native';

const {width, height} = Dimensions.get('window');

// Color palette
export const colors = {
  primary: '#91C788',
  primaryDark: '#7AB070',
  secondary: '#F8F8F8',
  background: '#FFFFFF',
  backgroundDark: '#1a1a1a',
  surface: '#F8F8F8',
  surfaceDark: '#2d2d2d',
  card: '#FFFFFF',
  cardDark: '#404040',
  text: '#333333',
  textDark: '#FFFFFF',
  textSecondary: '#666666',
  textSecondaryDark: '#CCCCCC',
  textMuted: '#999999',
  border: '#E5E5E5',
  borderDark: '#555555',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  shadow: '#000000',
};

// Typography
export const typography = {
  h1: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    lineHeight: width * 0.1,
  },
  h2: {
    fontSize: width * 0.065,
    fontWeight: 'bold',
    lineHeight: width * 0.08,
  },
  h3: {
    fontSize: width * 0.05,
    fontWeight: '600',
    lineHeight: width * 0.06,
  },
  body1: {
    fontSize: width * 0.04,
    fontWeight: 'normal',
    lineHeight: width * 0.05,
  },
  body2: {
    fontSize: width * 0.035,
    fontWeight: 'normal',
    lineHeight: width * 0.045,
  },
  caption: {
    fontSize: width * 0.03,
    fontWeight: 'normal',
    lineHeight: width * 0.038,
  },
  button: {
    fontSize: width * 0.045,
    fontWeight: '600',
    lineHeight: width * 0.055,
  },
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius
export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 50,
};

// Shadows
export const shadows = {
  small: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  medium: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5.46,
    elevation: 9,
  },
  large: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10.32,
    elevation: 16,
  },
};

// Create themed styles
export const createThemedStyles = (isDark = false) => {
  const theme = {
    colors: {
      primary: colors.primary,
      primaryDark: colors.primaryDark,
      background: isDark ? colors.backgroundDark : colors.background,
      surface: isDark ? colors.surfaceDark : colors.surface,
      card: isDark ? colors.cardDark : colors.card,
      text: isDark ? colors.textDark : colors.text,
      textSecondary: isDark ? colors.textSecondaryDark : colors.textSecondary,
      textMuted: colors.textMuted,
      border: isDark ? colors.borderDark : colors.border,
    },
  };

  return StyleSheet.create({
    // Container styles
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    safeContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },

    // Card styles
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginHorizontal: spacing.md,
      marginBottom: spacing.lg,
      ...shadows.small,
    },
    cardPrimary: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.xl,
      padding: spacing.lg,
      marginHorizontal: spacing.md,
      marginBottom: spacing.lg,
      ...shadows.medium,
    },
    cardSurface: {
      backgroundColor: theme.colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.md,
    },

    // Text styles
    title: {
      ...typography.h1,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: spacing.lg,
    },
    subtitle: {
      ...typography.h2,
      color: theme.colors.text,
      marginBottom: spacing.md,
    },
    sectionTitle: {
      ...typography.h3,
      color: theme.colors.text,
      marginBottom: spacing.md,
    },
    bodyText: {
      ...typography.body1,
      color: theme.colors.text,
    },
    bodyTextSecondary: {
      ...typography.body2,
      color: theme.colors.textSecondary,
    },
    caption: {
      ...typography.caption,
      color: theme.colors.textMuted,
    },
    textPrimary: {
      color: colors.primary,
      fontWeight: '600',
    },
    textWhite: {
      color: colors.background,
    },
    textCenter: {
      textAlign: 'center',
    },

    // Input styles
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      borderWidth: 1.5,
      borderColor: theme.colors.border,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.lg,
      ...shadows.small,
    },
    input: {
      flex: 1,
      height: height * 0.065,
      ...typography.body1,
      color: theme.colors.text,
    },
    inputIcon: {
      marginLeft: spacing.sm,
      fontSize: width * 0.045,
    },
    label: {
      ...typography.body1,
      color: theme.colors.text,
      marginBottom: spacing.sm,
      marginLeft: spacing.xs,
    },

    // Button styles
    button: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.md,
      paddingVertical: height * 0.02,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.md,
      ...shadows.medium,
    },
    buttonSecondary: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: borderRadius.md,
      paddingVertical: height * 0.02,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.md,
    },
    buttonText: {
      ...typography.button,
      color: colors.background,
    },
    buttonTextSecondary: {
      ...typography.button,
      color: theme.colors.text,
    },
    buttonSmall: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    buttonTextSmall: {
      ...typography.body2,
      color: colors.background,
      fontWeight: '600',
    },

    // Header styles
    header: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.lg,
      paddingBottom: spacing.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTitle: {
      ...typography.h2,
      color: theme.colors.text,
    },
    headerSubtitle: {
      ...typography.body2,
      color: theme.colors.textSecondary,
      marginTop: spacing.xs,
    },

    // List styles
    listItem: {
      backgroundColor: theme.colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    listItemText: {
      ...typography.body1,
      color: theme.colors.text,
    },
    listItemSecondary: {
      ...typography.body2,
      color: theme.colors.textSecondary,
    },

    // Stats and progress styles
    statCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      alignItems: 'center',
      flex: 1,
      marginHorizontal: spacing.xs,
    },
    statNumber: {
      ...typography.h3,
      color: theme.colors.text,
      fontWeight: 'bold',
    },
    statLabel: {
      ...typography.caption,
      color: theme.colors.textSecondary,
      marginTop: spacing.xs,
    },
    progressBar: {
      height: 8,
      backgroundColor: theme.colors.border,
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 4,
    },

    // Action styles
    actionGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: spacing.md,
      paddingHorizontal: spacing.md,
    },
    actionCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.md,
      alignItems: 'center',
      flex: 1,
      minWidth: 90,
      ...shadows.small,
    },
    actionIcon: {
      fontSize: 24,
      marginBottom: spacing.sm,
    },
    actionText: {
      ...typography.body2,
      color: theme.colors.text,
      textAlign: 'center',
      fontWeight: '500',
    },

    // Utility styles
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    spaceBetween: {
      justifyContent: 'space-between',
    },
    spaceAround: {
      justifyContent: 'space-around',
    },
    alignCenter: {
      alignItems: 'center',
    },
    marginTop: {
      marginTop: spacing.md,
    },
    marginBottom: {
      marginBottom: spacing.md,
    },
    paddingHorizontal: {
      paddingHorizontal: spacing.md,
    },
    paddingVertical: {
      paddingVertical: spacing.md,
    },

    // Empty state styles
    emptyState: {
      alignItems: 'center',
      paddingVertical: spacing.xxl,
    },
    emptyStateText: {
      ...typography.body1,
      color: theme.colors.textSecondary,
      marginBottom: spacing.sm,
    },
    emptyStateSubtext: {
      ...typography.body2,
      color: theme.colors.textMuted,
    },

    // Footer styles
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: spacing.lg,
    },
    footerText: {
      ...typography.body2,
      color: theme.colors.textSecondary,
    },
    footerLink: {
      ...typography.body2,
      color: colors.primary,
      fontWeight: 'bold',
    },
  });
};

// Export default light theme
export default createThemedStyles(false);
