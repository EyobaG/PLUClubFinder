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

router.post('/quiz-answers', (req, res) => {
    const { answers } = req.body;
  
    let query = 'SELECT * FROM some_table WHERE';
    const conditions = [];
  
    if (answers['question-1'] === 'Yes') {
      conditions.push('athletics_interest = 1');
    }
  
    if (answers['question-2'] === 'Yes') {
      conditions.push('competitive = 1');
    }
  
    // Example of handling multiple answers for a checkbox question
    if (answers['question-4'] && answers['question-4'].includes('Mathematics')) {
      conditions.push('subjects LIKE "%Mathematics%"');
    }
  
    // You can add more conditions based on other answers
  
    if (conditions.length > 0) {
      query += ' ' + conditions.join(' AND ');
    } else {
      query = 'SELECT * FROM some_table'; // Default query if no conditions
    }
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      res.json(results); // Send results back to the frontend
    });
});

// Other routes (GET, POST, PUT, DELETE) can go here

export default router;