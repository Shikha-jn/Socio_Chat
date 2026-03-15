// src/theme.ts

export const Colors = {
  // Primary cream background
  background: '#F5F0E8',
  backgroundAlt: '#EDE8DF',
  
  // Olive/Sage green accent
  primary: '#6B7B4A',
  primaryLight: '#8A9B62',
  primaryDark: '#4D5935',
  primaryPale: '#D4DDB8',
  
  // Warm neutrals
  white: '#FFFFFF',
  cream: '#FAF7F2',
  sand: '#E8E0D0',
  
  // Text
  textPrimary: '#1A1A1A',
  textSecondary: '#6B6B6B',
  textMuted: '#A0A0A0',
  textInverse: '#FFFFFF',
  
  // Accents
  gold: '#C9A84C',
  goldLight: '#F0D080',
  coral: '#E8785A',
  
  // Chat bubbles
  bubbleSent: '#6B7B4A',
  bubbleReceived: '#FFFFFF',
  bubbleSentText: '#FFFFFF',
  bubbleReceivedText: '#1A1A1A',
  
  // System
  border: '#E0D9CC',
  borderLight: '#EDE8DF',
  shadow: 'rgba(0,0,0,0.08)',
  overlay: 'rgba(0,0,0,0.4)',
  
  // Status
  online: '#5BB566',
  unread: '#E8785A',
};

export const Typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  sizes: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    xxl: 28,
    xxxl: 34,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 9999,
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
};
