import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
});

// Route for getting all users
router.get('/', (req, res) => {
  const query = 'SELECT * FROM ClubFinder.Tags';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Other user-related routes (GET, POST, PUT, DELETE) can go here

export default router;