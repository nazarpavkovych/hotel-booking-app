import React from 'react';
import { Card, CardMedia, CardContent, Typography, Button, Box } from '@mui/material';

const RoomCard = ({ room, onBook }) => {
  return (
    <Card sx={{ maxWidth: 345, margin: 'auto', boxShadow: 3 }}>
      <CardMedia
        component="img"
        height="200"
        image={room.imageUrl || "https://via.placeholder.com/300"}
        alt={room.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" color="primary">
          {room.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {room.description}
        </Typography>
        <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" color="secondary">
                {room.price} грн / ніч
            </Typography>
            <Button variant="contained" color="secondary" onClick={() => onBook(room)}>
                Забронювати
            </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RoomCard;