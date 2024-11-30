// server.js
import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import cors from 'cors';  // Import CORS middleware
import app from './App.js';  // Import routes and app configuration from app.js

dotenv.config(); // Load environment variables

const server = express();

// Enable CORS to allow requests from your React frontend (running on localhost:3000)
server.use(cors()); // This will enable CORS for all routes by default

// Create MySQL connection
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database');
});

// Middleware to parse JSON data in requests
server.use(express.json());

// Use the app.js routes and middleware
server.use(app);

// Start the Express server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});