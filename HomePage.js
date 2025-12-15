import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, Container, Typography, Button, Grid, CircularProgress, Alert 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { addDays, format } from 'date-fns';
import api from './api'; // Ваш налаштований API клієнт

// Імпорти компонентів
import BookingCalendar from './BookingCalendar';
import RoomCard from './RoomCard';
import BookingModal from './BookingModal';
import PoolIcon from '@mui/icons-material/Pool';

// --- СТИЛІ ---
const HeroSection = styled(Box)(({ theme }) => ({
  height: '80vh',
  backgroundImage: 'linear-gradient(rgba(10, 25, 47, 0.7), rgba(10, 25, 47, 0.7)), url(https://source.unsplash.com/random?luxury-hotel)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#fff',
  textAlign: 'center',
  padding: theme.spacing(2),
}));

const SectionTitle = ({ children, dark }) => (
  <Box mb={4} textAlign="center">
    <Typography variant="h3" color={dark ? "primary" : "secondary"} fontWeight="bold">
      {children}
    </Typography>
    <Box sx={{ width: 60, height: 4, bgcolor: '#D4AF37', margin: '10px auto' }} />
  </Box>
);

const HomePage = () => {
  // --- STATE ---
  const roomsSectionRef = useRef(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [error, setError] = useState(null);

  // Стан для Модального вікна
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);

  // Початкове завантаження (можна залишити порожнім або завантажити "типи номерів" для краси)
  useEffect(() => {
    // Тут ми поки залишимо статичні дані для першого вигляду, 
    // або можемо зробити запит на всі номери, якщо такий є.
    // Поки що залишимо, щоб сторінка не була пустою до вибору дати.
    setRooms([
      { id: 1, name: 'Стандарт', price: 1200, description: 'Оберіть дату щоб перевірити доступність', imageUrl: '' },
      { id: 2, name: 'Люкс', price: 2500, description: 'Оберіть дату щоб перевірити доступність', imageUrl: '' },
    ]);
  }, []);

  // --- 1. ЛОГІКА ПОШУКУ НОМЕРІВ ---
  const handleDateSelect = async (date) => {
    // Форматуємо дати для сервера (YYYY-MM-DD)
    const checkIn = format(date, 'yyyy-MM-dd');
    const checkOut = format(addDays(date, 1), 'yyyy-MM-dd'); // Стандарт: 1 ніч
    
    setSelectedDate(checkIn);
    setLoading(true);
    setError(null);

    // Плавний скрол до секції
    roomsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    try {
      // РЕАЛЬНИЙ ЗАПИТ НА СЕРВЕР
      // api.js сам підставить адресу Render
      const res = await api.get('/api/check-availability', { 
        params: { checkIn, checkOut }
      });

      // Сервер повертає масив вільних номерів
      setRooms(res.data);
      setLoading(false);
      
      if (res.data.length === 0) {
        setError("На жаль, на цю дату вільних місць немає.");
      }

    } catch (err) {
      console.error(err);
      setError("Не вдалося з'єднатися з сервером. Спробуйте пізніше.");
      setLoading(false);
    }
  };

  // --- 2. ВІДКРИТТЯ МОДАЛКИ ---
  const openBookingModal = (room) => {
    if (!selectedDate) {
      alert("Будь ласка, спочатку оберіть дату в календарі!");
      return;
    }
    setSelectedRoomForBooking(room);
    setModalOpen(true);
  };

  // --- 3. ВІДПРАВКА БРОНЮВАННЯ ---
  const handleBookingSubmit = async (guestData) => {
    // guestData приходить з модалки: { name: '...', phone: '...' }
    
    const checkOut = format(addDays(new Date(selectedDate), 1), 'yyyy-MM-dd');

    const bookingPayload = {
      roomId: selectedRoomForBooking.id,
      name: guestData.name,
      phone: guestData.phone,
      checkIn: selectedDate,
      checkOut: checkOut
    };

    try {
      // РЕАЛЬНИЙ ЗАПИТ НА СТВОРЕННЯ БРОНІ
      await api.post('/api/book', bookingPayload);
      
      alert(`Успішно! Номер ${selectedRoomForBooking.name} заброньовано на ${selectedDate}.`);
      setModalOpen(false);
      
      // Оновлюємо список номерів (прибираємо заброньований)
      handleDateSelect(new Date(selectedDate));
      
    } catch (err) {
      console.error(err);
      alert("Помилка бронювання. Можливо, хтось встиг забронювати раніше.");
    }
  };

  return (
    <Box>
      <HeroSection>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          GOLDEN STAY
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, maxWidth: '600px', fontWeight: 300 }}>
           12 ексклюзивних номерів для вашого спокою
        </Typography>
        <Button variant="contained" color="secondary" size="large" 
            onClick={() => roomsSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}>
          Забронювати номер
        </Button>
      </HeroSection>

      {/* --- CALENDAR SECTION --- */}
      <Box sx={{ bgcolor: 'primary.main', py: 8 }}>
        <Container maxWidth="lg">
          <SectionTitle>Перевірити дати</SectionTitle>
          <Grid container spacing={4}>
            <Grid item xs={12} md={5}>
              <Typography variant="h5" color="white" gutterBottom>
                 Оберіть дату заїзду
              </Typography>
              <Typography color="grey.400">
                Миттєве підтвердження наявності місць. Система автоматично перевіряє вільні номери в реальному часі.
              </Typography>
            </Grid>
            <Grid item xs={12} md={7}>
              <BookingCalendar onDateSelect={handleDateSelect} />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* --- ROOMS SECTION --- */}
      <Container sx={{ py: 8, minHeight: '500px' }} ref={roomsSectionRef}>
        <SectionTitle dark>
            {selectedDate ? `Номери на ${selectedDate}` : 'Наші Номери'}
        </SectionTitle>

        {loading ? (
          <Box display="flex" justifyContent="center" my={5}>
            <CircularProgress color="secondary" size={60} />
          </Box>
        ) : error ? (
          <Alert severity="warning" sx={{mt: 2}}>{error}</Alert>
        ) : (
          <Grid container spacing={4}>
            {rooms.map((room) => (
              <Grid item xs={12} md={4} key={room.id}>
                <RoomCard room={room} onBook={openBookingModal} />
              </Grid>
            ))}
          </Grid>
        )}
        
        {/* Підказка, якщо кімнати є, але це просто заглушки */}
        {!selectedDate && !loading && (
             <Box textAlign="center" mt={4} color="text.secondary">
                 <Typography variant="caption">Оберіть дату вище, щоб побачити актуальні ціни та доступність.</Typography>
             </Box>
        )}
      </Container>

      {/* --- SAUNA TEASER --- */}
      <Box sx={{ bgcolor: '#050d1a', py: 8, color: 'white', textAlign: 'center' }}>
         <Container>
            <PoolIcon sx={{ fontSize: 60, color: '#D4AF37', mb: 2 }} />
            <Typography variant="h4" color="secondary" gutterBottom>Фінська Сауна</Typography>
            <Typography paragraph color="grey.500" sx={{ maxWidth: 600, mx: 'auto' }}>
               Приватний відпочинок доступний для бронювання окремо.
            </Typography>
            <Button variant="outlined" color="secondary" href="/sauna">
               Забронювати час
            </Button>
         </Container>
      </Box>

      {/* --- MODAL --- */}
      <BookingModal 
        open={modalOpen} 
        handleClose={() => setModalOpen(false)} 
        room={selectedRoomForBooking}
        date={selectedDate}
        onSubmit={handleBookingSubmit}
      />
    </Box>
  );
};

export default HomePage;