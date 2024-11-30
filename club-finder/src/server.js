import mysql from "mysql2"
import dotenv from "dotenv"
import express from "express"
dotenv.config();

const app = express();
const PORT = process.env.MYSQL_PORT || 3000;

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database');
});

// Middleware to parse JSON data
app.use(express.json());

// Example route: Get all clubs from the database
app.get('/ClubFinder', (req, res) => {
  db.query('SELECT * FROM ClubFinder.Club', (err, results) => {
    if (err) {
      res.status(500).send('Error querying the database');
      return;
    }

    // Access the first club from the results
    const firstClub = results;
    console.log('First Club:', firstClub);

    // Send the results as a JSON response
    res.json(results);
  });
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
