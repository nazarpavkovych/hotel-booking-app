import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { Badge, Tooltip, Box, Typography } from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import ukLocale from 'date-fns/locale/uk'; // Українська локалізація

// Стилі для дня в календарі
const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== 'dayData',
})(({ theme, dayData, selected }) => ({
  ...(dayData?.available && {
    // Якщо вільно - звичайний вигляд
  }),
  ...(!dayData?.available && dayData !== undefined && {
    // Якщо зайнято - закреслено і сіре
    textDecoration: 'line-through',
    color: theme.palette.text.disabled,
    pointerEvents: 'none',
  }),
  ...(selected && {
    backgroundColor: theme.palette.secondary.main + ' !important', // Золотий при виборі
    color: '#000 !important',
  }),
}));

// Стиль ціни під датою
const PriceTag = styled('div')(({ theme }) => ({
  fontSize: '0.6rem',
  color: theme.palette.secondary.main, // Золотий колір ціни
  marginTop: '-2px',
}));

export default function BookingCalendar({ onDateSelect }) {
  const [calendarData, setCalendarData] = useState({});
  const [value, setValue] = useState(new Date());

  // Завантаження даних (заглушка)
  useEffect(() => {
    // Тут робимо запит axios.get('/api/calendar-month'...)
    // Імітуємо дані:
    setCalendarData({
      '2023-10-27': { price: 1200, available: true },
      '2023-10-28': { price: 1400, available: true },
      '2023-10-29': { price: null, available: false },
    });
  }, []);

  // Функція рендеру кожного дня
  const renderDay = (day, _value, DayComponentProps) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    const data = calendarData[dateKey];

    return (
      <Box key={day.toString()} sx={{ position: 'relative' }}>
        <CustomPickersDay
          {...DayComponentProps}
          dayData={data}
        />
        {/* Показуємо ціну, якщо доступно */}
        {data?.available && (
          <Box sx={{ position: 'absolute', bottom: 5, left: 0, right: 0, textAlign: 'center' }}>
            <PriceTag>{data.price}₴</PriceTag>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ukLocale}>
      <Box sx={{ 
          bgcolor: '#fff', 
          borderRadius: 2, 
          p: 2, 
          boxShadow: 3,
          border: '1px solid #D4AF37' // Золота рамка
      }}>
        <DateCalendar
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
            onDateSelect(newValue);
          }}
          slots={{
            day: renderDay,
          }}
          sx={{
            // Збільшуємо висоту клітинок, щоб влізла ціна
            '.MuiPickersDay-root': { height: '50px', margin: '2px' },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
}