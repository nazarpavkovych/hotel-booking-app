const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
app.use(cors({
    origin: '*', // Для початку дозволимо всім, пізніше зміните на адресу вашого сайту
}));
// Endpoint: Перевірка доступності номерів
app.get('/api/check-availability', async (req, res) => {
  const { checkIn, checkOut } = req.query;

  try {
    // Знаходимо номери, які НЕ зайняті в ці дати
    // Логіка: (StartA <= EndB) and (EndA >= StartB) визначає перетин
    const query = `
      SELECT r.*, rt.name, rt.price 
      FROM rooms r
      JOIN room_types rt ON r.type_id = rt.id
      WHERE r.id NOT IN (
        SELECT room_id FROM bookings 
        WHERE (check_in <= $2 AND check_out >= $1)
      )
    `;
    const result = await pool.query(query, [checkIn, checkOut]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Endpoint: Створення бронювання
app.post('/api/book', async (req, res) => {
  const { roomId, name, phone, checkIn, checkOut } = req.body;
  
  try {
    // Тут варто ще раз перевірити доступність перед вставкою
    const query = `
      INSERT INTO bookings (room_id, guest_name, guest_phone, check_in, check_out)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `;
    const newBooking = await pool.query(query, [roomId, name, phone, checkIn, checkOut]);
    res.json(newBooking.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
// Endpoint: Отримати ціни та статус на місяць
app.get('/api/calendar-month', async (req, res) => {
    const { year, month } = req.query; // наприклад year=2023, month=10 (0-11 або 1-12)
    
    // Логіка (спрощена):
    // 1. Генеруємо дні місяця.
    // 2. Для кожного дня шукаємо найдешевший ВІЛЬНИЙ номер.
    // 3. Якщо вільних немає -> status: 'full'.
    
    // Приклад SQL (псевдокод для стислості, в реальності краще процедура або складний JOIN):
    /*
     SELECT date_series, MIN(rt.price) as min_price, COUNT(r.id) as free_rooms
     FROM generate_series(...) as date_series
     LEFT JOIN rooms r ON ... (не зайняті)
     LEFT JOIN room_types rt ON ...
     GROUP BY date_series
    */
  
    // Для демонстрації фронтенду повернемо заглушку (Mock Data),
    // яку ви заміните на реальний SQL запит вище.
    const mockData = {
      '2023-10-25': { price: 1200, available: true },
      '2023-10-26': { price: 1500, available: true },
      '2023-10-27': { price: null, available: false }, // Зайнято
      // ...
    };
    
    res.json(mockData);
  });
// ВАЖЛИВО: Використовуйте process.env.PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));