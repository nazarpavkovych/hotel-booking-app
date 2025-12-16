import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Налаштування Day.js
import dayjs from 'dayjs';
import 'dayjs/locale/uk';
dayjs.locale('uk');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);