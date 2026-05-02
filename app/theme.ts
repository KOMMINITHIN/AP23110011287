import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#2158d4'
    },
    secondary: {
      main: '#0a7a5a'
    },
    background: {
      default: '#f4f7fb',
      paper: '#ffffff'
    }
  },
  shape: {
    borderRadius: 18
  },
  typography: {
    fontFamily: 'var(--font-body), Arial, sans-serif',
    h1: {
      fontFamily: 'var(--font-display), Georgia, serif',
      fontWeight: 700
    },
    h2: {
      fontFamily: 'var(--font-display), Georgia, serif',
      fontWeight: 700
    }
  }
});