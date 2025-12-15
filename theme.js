import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0A192F', // Темно-синій
    },
    secondary: {
      main: '#D4AF37', // Золотистий
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif', // Сучасний шрифт
    h1: { fontSize: '2.5rem', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0px', // Гострі кути для преміум вигляду
          textTransform: 'none',
        },
      },
    },
  },
});

export default theme;