import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Button, Typography, Box 
} from '@mui/material';

const BookingModal = ({ open, handleClose, room, date, onSubmit }) => {
  const [guest, setGuest] = useState({ name: '', phone: '' });

  const handleSubmit = () => {
    // Валідація
    if (!guest.name || !guest.phone) {
      alert("Будь ласка, заповніть всі поля");
      return;
    }
    // Передаємо дані "вгору"
    onSubmit(guest);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ bgcolor: '#0A192F', color: '#D4AF37' }}>
        Бронювання номеру
      </DialogTitle>
      
      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ my: 2 }}>
          <Typography variant="h6" color="primary">
             {room?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
             Дата заїзду: <b>{date || 'Дата не обрана'}</b>
          </Typography>
           <Typography variant="body2" color="text.secondary">
             Ціна: <b>{room?.price} грн</b>
          </Typography>
        </Box>

        <TextField
          autoFocus
          margin="dense"
          label="Ваше Ім'я"
          type="text"
          fullWidth
          variant="outlined"
          value={guest.name}
          onChange={(e) => setGuest({ ...guest, name: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Номер телефону"
          type="tel"
          fullWidth
          variant="outlined"
          value={guest.phone}
          onChange={(e) => setGuest({ ...guest, phone: e.target.value })}
        />
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} color="primary">Скасувати</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="secondary"
          sx={{ color: '#fff' }} // Білий текст на золотому фоні для читабельності
        >
          Підтвердити
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingModal;