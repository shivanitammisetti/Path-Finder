CREATE DATABASE pathfinder_db;

\c pathfinder_db;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  username TEXT,
  password TEXT
);