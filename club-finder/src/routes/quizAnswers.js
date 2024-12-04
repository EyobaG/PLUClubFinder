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
  const answers = req.body;
  console.log("Recieved quiz answers", answers);

  let tags = []
  let appends = [];

  if (answers['question-1'] == 'Yes') {
    tags.push("Athletic");
    if (answers['question-2'] == 'Yes') {
      tags.push("AthleticSerious");
    } else {
      tags.push("AthleticNonSerious");
    }
  }
  if (answers['question-3'] == 'Yes') {
    appends.push(" OR c.ClubID = 44");
  }
  if (answers['question-4'].includes("Mathematics")
    || answers['question-4'].includes("English")
    || answers['question-4'].includes("History")
    || answers['question-4'].includes("Lab Sciences")
    || answers['question-4'].includes("Social Sciences")) {
    tags.push("STEM");
  } else if (answers['question-4'].includes("Health")) {
    tags.push("Health");
  }
  if (answers['question-5'] == 'Yes') {
    tags.push("Civic Engagement");
  }
  if (answers['question-6'] == 'Yes') {
    tags.push("Creative Interest");
    if (answers['question-7'] == 'Yes') {
      tags.push("Music");
    }
    if (answers['question-8'] == 'Yes' || answers['question-4'].includes("Music")) {
      tags.push("Dance");
      tags.push("Theatre");
    }
  }
  if (answers['question-9'] == 'Yes') {
    tags.push("Gaming");
  }
  if (answers['question-10'] == 'Yes') {
    tags.push("Religious");
  }
  if (answers['question-11'] == 'Yes') {
    appends.push(" OR c.ClubID = 26");
  }

  let tagsSeparated = tags.length ? `'${tags.join("', '")}'` : "''";
  let appendsSeparated = appends.length ? " " + appends.join(" ") : "";

  const query = `
    SELECT DISTINCT 
      c.ClubID, 
      c.ClubName, 
      d.Description, 
      con.ClubContact, 
      CONCAT(con.OfficerFirstName, ' ', con.OfficerLastName) AS ClubPresident, 
      con.OfficerContact AS PresidentEmail, 
      w.URL AS Website
    FROM Tags t
    JOIN Club c ON t.ClubID = c.ClubID
    LEFT JOIN Description d ON c.ClubID = d.ClubID
    LEFT JOIN Contacts con ON c.ClubID = con.ClubID
    LEFT JOIN Websites w ON c.ClubID = w.ClubID
    WHERE t.Tag IN (${tagsSeparated})
    ${appendsSeparated}
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

export default router;