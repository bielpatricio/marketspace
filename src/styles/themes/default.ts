import { extendTheme } from 'native-base'

export const theme = extendTheme({
  colors: {
    white: '#fff',

    gray: {
      100: '#1a181b',
      200: '#3e3a40',
      300: '#5f5b62',
      400: '#9f9ba1',
      500: '#d9d8da',
      600: '#edecee',
      700: '#f7f7f8',
    },
    red: {
      300: '#ee7979',
    },

    purple: {
      300: '#a855f7',
      500: '#6b218a',
    },
  },
  fonts: {
    regular: 'Karla_400Regular',
    bold: 'Karla_700Bold',
  },
  fontSizes: {
    xs: 14,
    sm: 16,
    md: 18,
    lg: 24,
    xl: 28,
  },
  sizes: {
    14: 56,
    26: 100,
    33: 148,
  },
})
