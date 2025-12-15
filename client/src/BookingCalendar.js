import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'; // ВАЖЛИВО: V3 для нових версій
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { Box } from '@mui/material';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale'; // ВАЖЛИВО: Новий стиль імпорту мови

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
    backgroundColor: theme.palette.secondary.main + ' !important',
    color: '#000 !important',
  }),
}));

// Стиль ціни під датою
const PriceTag = styled('div')(({ theme }) => ({
  fontSize: '0.6rem',
  color: theme.palette.secondary.main,
  marginTop: '-2px',
}));

export default function BookingCalendar({ onDateSelect }) {
  const [calendarData, setCalendarData] = useState({});
  const [value, setValue] = useState(new Date());

  useEffect(() => {
    // Імітуємо дані (або тут може бути запит до API)
    setCalendarData({
      '2023-10-27': { price: 1200, available: true },
      '2023-10-28': { price: 1400, available: true },
      '2023-10-29': { price: null, available: false },
    });
  }, []);

  const renderDay = (day, _value, DayComponentProps) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    const data = calendarData[dateKey];

    return (
      <Box key={day.toString()} sx={{ position: 'relative' }}>
        <CustomPickersDay
          {...DayComponentProps}
          dayData={data}
        />
        {data?.available && (
          <Box sx={{ position: 'absolute', bottom: 5, left: 0, right: 0, textAlign: 'center' }}>
            <PriceTag>{data.price}₴</PriceTag>
          </Box>
        )}
      </Box>
    );
  };

  return (
    // Використовуємо uk з нового імпорту
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={uk}>
      <Box sx={{ 
          bgcolor: '#fff', 
          borderRadius: 2, 
          p: 2, 
          boxShadow: 3,
          border: '1px solid #D4AF37'
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
            '.MuiPickersDay-root': { height: '50px', margin: '2px' },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
}