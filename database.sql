-- Таблиця типів номерів (наприклад: Стандарт, Люкс)
CREATE TABLE room_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    capacity INT NOT NULL,
    description TEXT
);

-- Таблиця самих номерів (12 штук)
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    room_number VARCHAR(10) UNIQUE NOT NULL,
    type_id INT REFERENCES room_types(id),
    status VARCHAR(20) DEFAULT 'available' -- available, maintenance
);

-- Таблиця бронювань
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    room_id INT REFERENCES rooms(id),
    guest_name VARCHAR(100) NOT NULL,
    guest_phone VARCHAR(20) NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'confirmed'
);

-- Таблиця для Сауни (бронювання по годинах)
CREATE TABLE sauna_bookings (
    id SERIAL PRIMARY KEY,
    guest_name VARCHAR(100) NOT NULL,
    guest_phone VARCHAR(20) NOT NULL,
    booking_date DATE NOT NULL,           -- Окрема дата (2023-10-25)
    start_time TIME NOT NULL,             -- Початок (14:00:00)
    end_time TIME NOT NULL,               -- Кінець (16:00:00)
    total_price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraint (Обмеження): Забороняє створення запису, якщо час перетинається
    -- Це "золотий стандарт" захисту даних на рівні БД
    EXCLUDE USING gist (
        tsrange(booking_date + start_time, booking_date + end_time) WITH &&
    )
);