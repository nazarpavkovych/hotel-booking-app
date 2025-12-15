// Константи
const OPENING_HOUR = 10; // 10:00
const CLOSING_HOUR = 22; // 22:00
const SLOT_DURATION = 1; // 1 година (мінімальний слот)

// API: Отримати доступні години на конкретну дату
app.get('/api/sauna/slots', async (req, res) => {
  const { date } = req.query; // формат YYYY-MM-DD

  try {
    // 1. Отримуємо всі бронювання на цю дату
    const result = await pool.query(
      `SELECT start_time, end_time FROM sauna_bookings WHERE booking_date = $1`,
      [date]
    );
    const bookings = result.rows;

    // 2. Генеруємо всі можливі слоти (10:00, 11:00 ... 21:00)
    let availableSlots = [];
    
    for (let hour = OPENING_HOUR; hour < CLOSING_HOUR; hour++) {
      // Формуємо час початку поточного слоту (напр. "14:00:00")
      const currentSlotStart = `${hour}:00:00`;
      const currentSlotEnd = `${hour + SLOT_DURATION}:00:00`;

      // 3. Перевіряємо, чи цей слот не перетинається з існуючими бронями
      const isBusy = bookings.some(booking => {
        // Логіка перетину: (StartA < EndB) && (EndA > StartB)
        return (currentSlotStart < booking.end_time) && (currentSlotEnd > booking.start_time);
      });

      if (!isBusy) {
        availableSlots.push({
          time: `${hour}:00`,
          display: `${hour}:00 - ${hour + 1}:00`
        });
      }
    }

    res.json(availableSlots);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// API: Забронювати сауну
app.post('/api/sauna/book', async (req, res) => {
  const { name, phone, date, time } = req.body; // time = "14:00"

  // Обчислюємо end_time (+1 година)
  const [hour, minute] = time.split(':');
  const endHour = parseInt(hour) + 1;
  const endTime = `${endHour}:${minute}`;

  try {
    // Подвійна перевірка на сервері перед записом (щоб уникнути race condition)
    const checkQuery = `
      SELECT * FROM sauna_bookings 
      WHERE booking_date = $1 
      AND (start_time < $3 AND end_time > $2)
    `;
    const conflict = await pool.query(checkQuery, [date, time, endTime]);

    if (conflict.rows.length > 0) {
      return res.status(400).json({ message: 'Цей час вже зайнято!' });
    }

    // Вставка
    const insertQuery = `
      INSERT INTO sauna_bookings (guest_name, guest_phone, booking_date, start_time, end_time)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `;
    const newBooking = await pool.query(insertQuery, [name, phone, date, time, endTime]);
    
    res.json(newBooking.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});