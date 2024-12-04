import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import cors from 'cors';
import clubRoutes from "./routes/clubs.js";
import contactRoutes from "./routes/contacts.js";
import descriptionRoutes from "./routes/descriptions.js";
import meetingTimeRoutes from "./routes/meetingTimes.js";
import tagRoutes from "./routes/tags.js";
import websiteRoutes from "./routes/websites.js";
import quizAnswersRoutes from "./routes/quizAnswers.js";
dotenv.config();

const server = express();
server.use(cors()); // Enable CORS to allow requests from your React frontend (running on localhost:3000)
server.use(express.json()); // Middleware to parse JSON data in requests

// Set urls for fetching data from the backend
// You can add your own queries by going to ./routes and editing/creating new js files
server.use('/api/clubs', clubRoutes);
server.use('/api/contacts', contactRoutes);
server.use('/api/descriptions', descriptionRoutes);
server.use('/api/meeting-times', meetingTimeRoutes);
server.use('/api/tags', tagRoutes);
server.use('/api/websites', websiteRoutes);
server.use('/api/quiz-answers', quizAnswersRoutes);

// Start the Express server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
