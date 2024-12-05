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

  /* Further logic needed,
   * should filter out all AthleticSerious
   * clubs if choosing NonSerious*/
  if (answers['question-1'] == 'Yes') {
    tags.push("Athletic")

    if (answers['question-2'] == 'Competitive') {
      tags.push("AthleticSerious");
    } else {
      tags.push("AthleticNonSerious");
    }
    
  }

  if (answers['question-3'] == 'Yes') {
    appends.push("OR c.ClubID = 44");
  }

  if (Array.isArray(answers['question-4'])) {
    const question4 = answers['question-4'];
    if (
      question4.includes("Mathematics") ||
      question4.includes("English") ||
      question4.includes("History") ||
      question4.includes("Lab Sciences") ||
      question4.includes("Social Sciences")
    ) {
      tags.push("STEM");
    } if (question4.includes("Health")) {
      tags.push("Health");
    } if (question4.includes("Music")) {
      tags.push("Music");
    }
  } else if (answers['question-4']) {
    console.log("Question-4 exists but is not an array");
  } else {
    console.log("No data found for question-4 or it's not an array");
  }

  if (answers['question-5'] == 'Yes') {
    tags.push("Civic Engagement");
  }

  if (answers['question-6'] == 'Yes') {
    tags.push("Creative Interest");

    if (answers['question-7'] == 'Yes') {
      tags.push("Music");
    }
  
    if (answers['question-8'] == 'Yes') {
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
    appends.push("OR c.ClubID = 26");
  }

  let tagsSeparated = tags.length ? `'${tags.join("', '")}'` : "''";
  let appendsSeparated = appends.length ? " " + appends.join(" ") : "";

  let query = ``;

  if (tagsSeparated === "''" && !appendsSeparated) {
    return res.status(400).json({ message: "No valid tags or filters selected." });
  } else if (tagsSeparated === "''") {
    query = `
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
    WHERE 1+1=3` + appendsSeparated;
  } else {
  query = `
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
    AND NOT EXISTS (
      SELECT 1
      FROM Tags t2
      WHERE t2.ClubID = c.ClubID
      AND (
        (t2.Tag = 'AthleticSerious' AND EXISTS (SELECT 1 FROM Tags t3 WHERE t3.ClubID = c.ClubID AND t3.Tag = 'AthleticNonSerious'))
        OR 
        (t2.Tag = 'AthleticNonSerious' AND EXISTS (SELECT 1 FROM Tags t3 WHERE t3.ClubID = c.ClubID AND t3.Tag = 'AthleticSerious'))
      )
    )` + appendsSeparated;
  }

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

export default router;