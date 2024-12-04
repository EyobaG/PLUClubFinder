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

router.post('/', (req, res) => {
    const { tags } = req.query;
    
    if (!tags) {
      return res.status(400).json({ error: "Tags are required" });
    }
    
    const tagList = tags.split(","); // Split tags into an array
    const placeholders = tagList.map(() => '?').join(',');
    
    const query = `
      SELECT 
        c.ClubName, 
        d.Description, 
        con.ClubContact, 
        CONCAT(con.OfficerFirstName, ' ', con.OfficerLastName) AS ClubPresident, 
        con.OfficerContact AS PresidentEmail,
        w.URL AS Website
        FROM 
          Tags t
        JOIN 
          Club c ON t.ClubID = c.ClubID
        LEFT JOIN 
          Description d ON c.ClubID = d.ClubID
        LEFT JOIN 
          Contacts con ON c.ClubID = con.ClubID
        LEFT JOIN 
          Websites w ON c.ClubID = w.ClubID
        WHERE 
            t.Tag IN (${placeholders});
        `;
    db.query(query, (err, results) => {
        if (err) {
        console.error('Error fetching users:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    })
});

export default router();