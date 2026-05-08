CREATE TABLE loss (
    id SERIAL PRIMARY KEY,
    amount DOUBLE PRECISION,
    description TEXT,
    deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP
);