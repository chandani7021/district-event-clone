import { DarkTheme, type Theme } from '@react-navigation/native';

export const THEME = {
  dark: {
    background: '#0a0a0a',
    foreground: '#ffffff',
    card: '#171717',
    cardForeground: '#ffffff',
    popover: '#171717',
    popoverForeground: '#ffffff',
    primary: '#8B5CF6',
    primaryForeground: '#09090B',
    secondary: '#282828',
    secondaryForeground: '#dcdcdc',
    muted: '#3c3c3c',
    mutedForeground: '#a0a0a0',
    accent: '#282828',
    accentForeground: '#dcdcdc',
    destructive: '#EF4444',
    border: '#262626',
    input: '#9ca3af',
    ring: '#8B5CF6',
    radius: '0.5rem',
    brandLight: '#eae5ff',
    brandMedium: '#8B5CF6',
    brandMuted: '#916be9ff',
    district_clone_orange: '#9b44c7',
  },
};

export const NAV_THEME: Record<'light' | 'dark', Theme> = {
  light: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
};
