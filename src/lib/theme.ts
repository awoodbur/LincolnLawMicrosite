/**
 * Lincoln Law brand theme configuration.
 * Professional, modern design with legal industry trust signals.
 */

export const theme = {
  colors: {
    primary: {
      light: '#60A5FA', // Light blue
      DEFAULT: '#3B82F6', // Blue
      dark: '#1E40AF', // Dark blue
    },
    secondary: {
      light: '#E5E7EB',
      DEFAULT: '#6B7280',
      dark: '#374151',
    },
    accent: {
      DEFAULT: '#F59E0B', // Amber for CTA
      hover: '#D97706',
    },
    neutral: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      serif: ['Merriweather', 'Georgia', 'serif'],
    },
  },
  brand: {
    name: 'Lincoln Law',
    tagline: 'Justice • Fairness • Honesty',
    serviceArea: 'Utah',
  },
} as const;
