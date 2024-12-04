import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import cors from 'cors';
import clubRoute from "./routes/clubs.js";
import contactRoute from "./routes/contacts.js";
import descriptionRoute from "./routes/descriptions.js";
import meetingTimeRoute from "./routes/meetingTimes.js";
import tagRoute from "./routes/tags.js";
import websiteRoute from "./routes/websites.js";
import quizAnswersRoute from "./routes/quizAnswers.js";
import tagSearchRoute from "./routes/quizAnswers.js";
dotenv.config();

const server = express();
server.use(cors()); // Enable CORS to allow requests from your React frontend (running on localhost:3000)
server.use(express.json()); // Middleware to parse JSON data in requests

// Set urls for fetching data from the backend
// You can add your own queries by going to ./routes and editing/creating new js files
server.use('/api/clubs', clubRoute);
server.use('/api/contacts', contactRoute);
server.use('/api/descriptions', descriptionRoute);
server.use('/api/meeting-times', meetingTimeRoute);
server.use('/api/tags', tagRoute);
server.use('/api/websites', websiteRoute);
server.use('/api/quiz-answers', quizAnswersRoute);
server.use('/api/tag-search', tagSearchRoute);

// Start the Express server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
