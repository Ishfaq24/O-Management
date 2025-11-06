import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#f5e5ff',
      100: '#e0bbff',
      200: '#c68eff',
      300: '#aa5fff',
      400: '#8f30ff',
      500: '#7611e6',
      600: '#5b0bb3',
      700: '#400780',
      800: '#26034d',
      900: '#0d001a',
    },
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
});

export default theme;
