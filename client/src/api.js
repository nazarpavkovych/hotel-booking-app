// client/src/api.js
import axios from 'axios';

// Якщо ми на Render, використовуємо змінну середовища, інакше - локалхост
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_URL
});

export default api;