import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: { main: '#4E342E' }, // Dark brown
    secondary: { main: '#D7CCC8' }, // Light beige
    background: { default: '#FFF8F0' }, // Cream
    text: { primary: '#3E2723' }, // Dark text
  },
  typography: {
    fontFamily: '"Open Sans", Roboto, sans-serif',
    h4: { fontWeight: 700, color: '#3E2723' },
    h5: { fontWeight: 600, color: '#4E342E' },
    body1: { fontSize: '1.1rem' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 600,
        },
        containedPrimary: {
          backgroundColor: '#5D4037',
          '&:hover': { backgroundColor: '#3E2723' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          background: '#FFFFFF',
          transition: 'transform 0.2s',
          '&:hover': { transform: 'scale(1.03)' },
        },
      },
    },
  },
});

export default theme;