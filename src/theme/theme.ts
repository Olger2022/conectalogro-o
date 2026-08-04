import { createTheme, ThemeOptions } from '@mui/material/styles';

export const INSTITUTIONAL_COLORS = {
  primary: '#0057B8', // Azul Institucional GAD Logroño
  primaryDark: '#003D82',
  primaryLight: '#3379C6',
  secondary: '#2E7D32', // Verde Amazonía
  secondaryLight: '#4CAF50',
  backgroundLight: '#F4F6F8',
  surfaceLight: '#FFFFFF',
  textPrimaryLight: '#1E293B',
  textSecondaryLight: '#64748B',

  // Dark mode
  backgroundDark: '#0F172A',
  surfaceDark: '#1E293B',
  textPrimaryDark: '#F8FAFC',
  textSecondaryDark: '#94A3B8',

  // High contrast override
  highContrastBg: '#000000',
  highContrastSurface: '#121212',
  highContrastText: '#FFFFFF',
  highContrastYellow: '#FFD700',

  error: '#B3261E',
  warning: '#F9A825',
  success: '#2E7D32',
  info: '#0057B8',
};

export const createLogronoTheme = (
  darkMode: boolean = false,
  highContrast: boolean = false,
  fontSizeMultiplier: number = 1
) => {
  const baseFontSize = 14 * fontSizeMultiplier;

  let palette: ThemeOptions['palette'];

  if (highContrast) {
    palette = {
      mode: 'dark',
      primary: {
        main: '#FFD700', // High contrast bright yellow
        contrastText: '#000000',
      },
      secondary: {
        main: '#00FF00',
        contrastText: '#000000',
      },
      background: {
        default: INSTITUTIONAL_COLORS.highContrastBg,
        paper: INSTITUTIONAL_COLORS.highContrastSurface,
      },
      text: {
        primary: INSTITUTIONAL_COLORS.highContrastText,
        secondary: '#EEEEEE',
      },
      divider: '#FFFFFF',
      error: { main: '#FF5252' },
      warning: { main: '#FFD600' },
      success: { main: '#00E676' },
      info: { main: '#40C4FF' },
    };
  } else if (darkMode) {
    palette = {
      mode: 'dark',
      primary: {
        main: '#4392F1',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#66BB6A',
        contrastText: '#FFFFFF',
      },
      background: {
        default: INSTITUTIONAL_COLORS.backgroundDark,
        paper: INSTITUTIONAL_COLORS.surfaceDark,
      },
      text: {
        primary: INSTITUTIONAL_COLORS.textPrimaryDark,
        secondary: INSTITUTIONAL_COLORS.textSecondaryDark,
      },
      divider: '#334155',
      error: { main: '#EF5350' },
      warning: { main: '#FFA726' },
      success: { main: '#66BB6A' },
      info: { main: '#29B6F6' },
    };
  } else {
    palette = {
      mode: 'light',
      primary: {
        main: INSTITUTIONAL_COLORS.primary,
        dark: INSTITUTIONAL_COLORS.primaryDark,
        light: INSTITUTIONAL_COLORS.primaryLight,
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: INSTITUTIONAL_COLORS.secondary,
        light: INSTITUTIONAL_COLORS.secondaryLight,
        contrastText: '#FFFFFF',
      },
      background: {
        default: INSTITUTIONAL_COLORS.backgroundLight,
        paper: INSTITUTIONAL_COLORS.surfaceLight,
      },
      text: {
        primary: INSTITUTIONAL_COLORS.textPrimaryLight,
        secondary: INSTITUTIONAL_COLORS.textSecondaryLight,
      },
      divider: '#E2E8F0',
      error: { main: INSTITUTIONAL_COLORS.error },
      warning: { main: INSTITUTIONAL_COLORS.warning },
      success: { main: INSTITUTIONAL_COLORS.success },
      info: { main: INSTITUTIONAL_COLORS.info },
    };
  }

  return createTheme({
    palette,
    typography: {
      fontSize: baseFontSize,
      fontFamily: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        'sans-serif',
      ].join(','),
      h1: { fontWeight: 800, fontSize: `${2.2 * fontSizeMultiplier}rem` },
      h2: { fontWeight: 700, fontSize: `${1.8 * fontSizeMultiplier}rem` },
      h3: { fontWeight: 700, fontSize: `${1.5 * fontSizeMultiplier}rem` },
      h4: { fontWeight: 600, fontSize: `${1.3 * fontSizeMultiplier}rem` },
      h5: { fontWeight: 600, fontSize: `${1.1 * fontSizeMultiplier}rem` },
      h6: { fontWeight: 600, fontSize: `${1.0 * fontSizeMultiplier}rem` },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: '8px 20px',
            minHeight: 44, // WCAG touch target
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            boxShadow: darkMode
              ? '0px 4px 20px rgba(0, 0, 0, 0.4)'
              : '0px 4px 16px rgba(0, 87, 184, 0.06)',
            border: highContrast ? '2px solid #FFFFFF' : '1px solid rgba(226, 232, 240, 0.8)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            borderRadius: 8,
          },
        },
      },
    },
  });
};
