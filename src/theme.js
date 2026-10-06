import { Platform } from 'react-native';

const colors = {
  primary: '#075BBB',
  primaryDark: '#064B98',
  primarySoft: '#E8F2FC',
  background: '#F4F6F8',
  surface: '#FFFFFF',
  text: '#182431',
  textSecondary: '#71808F',
  border: '#E3E8ED',
  success: '#208B63',
  successSoft: '#E7F5EF',
  warning: '#B97816',
  warningSoft: '#FFF4DF',
  danger: '#C34E50',
  dangerSoft: '#FCEBEC',
  muted: '#F0F2F4',
  white: '#FFFFFF',
};

const fontSizes = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  pill: 999,
};

export function getShadow(offsetY = 2, radiusValue = 8, opacity = 0.07, elevation = 2, color = '#182431') {
  return Platform.select({
    web: {
      boxShadow: `0px ${offsetY}px ${radiusValue}px rgba(24, 36, 49, ${opacity})`,
    },
    default: {
      shadowColor: color,
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: radiusValue,
      elevation,
    },
  });
}

const shadows = {
  card: getShadow(2, 8, 0.07, 2),
  raised: getShadow(4, 10, 0.12, 4),
  subtle: getShadow(1, 4, 0.05, 1),
};

export { colors, fontSizes, spacing, radius, shadows };
