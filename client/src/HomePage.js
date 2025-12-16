import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, Container, Typography, Button, Grid, CircularProgress, Alert 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs'; 
import api from './api';

import BookingCalendar from './BookingCalendar';
import RoomCard from './RoomCard';
import BookingModal from './BookingModal';
import PoolIcon from '@mui/icons-material/Pool';

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
  const roomsSectionRef = useRef(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);

  useEffect(() => {
    setRooms([
      { id: 1, name: 'Стандарт', price: 1200, description: 'Оберіть дату щоб перевірити доступність', imageUrl: '' },
      { id: 2, name: 'Люкс', price: 2500, description: 'Оберіть дату щоб перевірити доступність', imageUrl: '' },
    ]);
  }, []);

  // --- ВИПРАВЛЕННЯ ТУТ ---
  const handleDateSelect = async (rawDate) => {
    // Обгортаємо вхідну дату в dayjs(), щоб точно мати правильний об'єкт
    const dateObject = dayjs(rawDate);
    
    const checkIn = dateObject.format('YYYY-MM-DD');
    const checkOut = dateObject.add(1, 'day').format('YYYY-MM-DD');
    
    setSelectedDate(checkIn);
    setLoading(true);
    setError(null);

    roomsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    try {
      const res = await api.get('/api/check-availability', { 
        params: { checkIn, checkOut }
      });
      setRooms(res.data);
      setLoading(false);
      
      if (res.data.length === 0) {
        setError("На жаль, на цю дату вільних місць немає.");
      }
    } catch (err) {
      console.error(err);
      setError("Не вдалося з'єднатися з сервером.");
      setLoading(false);
    }
  };

  const openBookingModal = (room) => {
    if (!selectedDate) {
      alert("Будь ласка, спочатку оберіть дату в календарі!");
      return;
    }
    setSelectedRoomForBooking(room);
    setModalOpen(true);
  };

  const handleBookingSubmit = async (guestData) => {
    const checkOut = dayjs(selectedDate).add(1, 'day').format('YYYY-MM-DD');

    const bookingPayload = {
      roomId: selectedRoomForBooking.id,
      name: guestData.name,
      phone: guestData.phone,
      checkIn: selectedDate,
      checkOut: checkOut
    };

    try {
      await api.post('/api/book', bookingPayload);
      alert(`Успішно! Номер ${selectedRoomForBooking.name} заброньовано.`);
      setModalOpen(false);
      handleDateSelect(dayjs(selectedDate));
    } catch (err) {
      console.error(err);
      alert("Помилка бронювання.");
    }
  };

  return (
    <Box>
      <HeroSection>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          GOLDEN STAY
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, maxWidth: '600px', fontWeight: 300 }}>
           12 ексклюзивних номерів
        </Typography>
        <Button variant="contained" color="secondary" size="large" 
            onClick={() => roomsSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}>
          Забронювати номер
        </Button>
      </HeroSection>

      <Box sx={{ bgcolor: 'primary.main', py: 8 }}>
        <Container maxWidth="lg">
          <SectionTitle>Перевірити дати</SectionTitle>
          <Grid container spacing={4}>
            <Grid item xs={12} md={5}>
              <Typography variant="h5" color="white" gutterBottom>
                 Оберіть дату заїзду
              </Typography>
              <Typography color="grey.400">
                Система автоматично перевіряє вільні номери.
              </Typography>
            </Grid>
            <Grid item xs={12} md={7}>
              <BookingCalendar onDateSelect={handleDateSelect} />
            </Grid>
          </Grid>
        </Container>
      </Box>

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
        
        {!selectedDate && !loading && (
             <Box textAlign="center" mt={4} color="text.secondary">
                 <Typography variant="caption">Оберіть дату вище.</Typography>
             </Box>
        )}
      </Container>

      <Box sx={{ bgcolor: '#050d1a', py: 8, color: 'white', textAlign: 'center' }}>
         <Container>
            <PoolIcon sx={{ fontSize: 60, color: '#D4AF37', mb: 2 }} />
            <Typography variant="h4" color="secondary" gutterBottom>Фінська Сауна</Typography>
            <Button variant="outlined" color="secondary" href="/sauna">
               Забронювати час
            </Button>
         </Container>
      </Box>

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