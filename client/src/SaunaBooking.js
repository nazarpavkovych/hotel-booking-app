import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Button, TextField, Paper, Alert 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import api from '../api';
// Стилізована кнопка часу (Золота при виборі)
const TimeSlotButton = styled(Button)(({ theme, selected }) => ({
  width: '100%',
  padding: '15px 0',
  border: `1px solid ${theme.palette.secondary.main}`,
  color: selected ? '#000' : theme.palette.secondary.main, // Золотий текст або чорний на золотому
  backgroundColor: selected ? theme.palette.secondary.main : 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.secondary.light,
    color: '#000',
  },
  '&.Mui-disabled': {
    borderColor: '#333',
    color: '#555',
  }
}));

const SaunaBooking = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10)); // YYYY-MM-DD
  const [slots, setSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [status, setStatus] = useState(null); // success | error

  // Завантаження доступних слотів при зміні дати
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/sauna/slots?date=${selectedDate}`);
        setSlots(res.data);
        setSelectedTime(null); // Скидаємо вибір при зміні дати
      } catch (err) {
        console.error("Помилка завантаження слотів");
      }
    };
    fetchSlots();
  }, [selectedDate]);

  const handleBook = async () => {
    if (!selectedTime || !formData.name || !formData.phone) {
      alert("Будь ласка, заповніть всі поля");
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/sauna/book', {
        date: selectedDate,
        time: selectedTime,
        name: formData.name,
        phone: formData.phone
      });
      setStatus('success');
      // Оновити слоти після успішного бронювання
      const res = await axios.get(`http://localhost:5000/api/sauna/slots?date=${selectedDate}`);
      setSlots(res.data);
      setSelectedTime(null);
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <Typography variant="h4" color="secondary" align="center" gutterBottom>
        Бронювання Сауни
      </Typography>

      {/* 1. Вибір дати (стандартний нативний календар, ідеально для мобільних) */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: '#102A43' }}>
        <TextField
          label="Оберіть дату"
          type="date"
          fullWidth
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          InputLabelProps={{ shrink: true, style: { color: '#D4AF37' } }}
          inputProps={{ style: { color: 'white' } }} // Білий текст
          sx={{
            svg: { color: '#D4AF37' },
            fieldset: { borderColor: '#D4AF37' }
          }}
        />
      </Paper>

      {/* 2. Сітка часу (Mobile First Grid) */}
      <Typography variant="h6" color="white" gutterBottom>
        Доступні години:
      </Typography>
      
      {slots.length === 0 ? (
        <Typography color="gray">На жаль, на цю дату вільних місць немає.</Typography>
      ) : (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {slots.map((slot) => (
            <Grid item xs={4} sm={3} key={slot.time}>
              <TimeSlotButton
                variant="outlined"
                selected={selectedTime === slot.time}
                onClick={() => setSelectedTime(slot.time)}
              >
                {slot.time}
              </TimeSlotButton>
            </Grid>
          ))}
        </Grid>
      )}

      {/* 3. Форма контактів (з'являється тільки коли обрано час) */}
      {selectedTime && (
        <Paper elevation={3} sx={{ p: 3, bgcolor: 'white' }}>
          <Typography variant="subtitle1" gutterBottom>
            Ви бронюєте сауну на <b>{selectedDate}</b> о <b>{selectedTime}</b>
          </Typography>
          <TextField
            label="Ваше ім'я"
            fullWidth
            margin="normal"
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <TextField
            label="Телефон"
            fullWidth
            margin="normal"
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth 
            size="large" 
            sx={{ mt: 2, bgcolor: '#0A192F', color: '#D4AF37' }}
            onClick={handleBook}
          >
            Підтвердити бронювання
          </Button>
        </Paper>
      )}

      {/* Повідомлення про статус */}
      {status === 'success' && (
        <Alert severity="success" sx={{ mt: 2 }}>Бронювання успішне! Чекаємо на вас.</Alert>
      )}
      {status === 'error' && (
        <Alert severity="error" sx={{ mt: 2 }}>Помилка! Можливо, цей час вже зайняли.</Alert>
      )}
    </Box>
  );
};

export default SaunaBooking;