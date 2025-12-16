import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';     // Ваша тема
import HomePage from './HomePage'; // Ваш основний компонент

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Скидання стандартних відступів браузера */}
      <HomePage />    {/* Відображення всього сайту */}
    </ThemeProvider>
  );
}

export default App;