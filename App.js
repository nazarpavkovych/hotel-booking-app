import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Container, Grid, Typography, Box } from '@mui/material';
import api from './api';
import theme from './theme';
import RoomCard from './RoomCard';
// Імпортуйте ваші компоненти Header, Hero тощо тут

function App() {
  const [rooms, setRooms] = useState([]);
  const [dates, setDates] = useState({ checkIn: '2023-10-25', checkOut: '2023-10-27' });

  // Mobile first: Grid item xs={12} (весь екран на мобільному) md={4} (3 колонки на пк)
  
  const searchRooms = async () => {
    try {
      // AJAX запит до бекенду
 // Ми пишемо ТІЛЬКИ кінцівку шляху.
// api.js сам підставить "https://ваш-сайт.onrender.com" або "http://localhost:5000"
const res = await api.get(`/api/check-availability`, {
    params: { checkIn, checkOut }
  });
      setRooms(res.data);
    } catch (error) {
      console.error("Error fetching rooms", error);
    }
  };

  useEffect(() => {
    // Завантажити початковий список або чекати поки користувач обере дати
    searchRooms();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Скидання стилів браузера */}
      
      {/* Header тут */}
      
      <Container sx={{ py: 4 }}>
        <Typography variant="h3" align="center" color="primary" gutterBottom>
           Наші Номери
        </Typography>
        <Typography variant="subtitle1" align="center" sx={{ mb: 4, color: 'gray' }}>
           Ексклюзивний відпочинок та сауна
        </Typography>

        <Grid container spacing={4}>
          {rooms.map((room) => (
            <Grid item key={room.id} xs={12} sm={6} md={4}>
              <RoomCard room={room} onBook={(r) => alert(`Бронюємо ${r.name}`)} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;