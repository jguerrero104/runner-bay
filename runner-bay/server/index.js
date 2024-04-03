 // Ensure this is at the top to load environment variables first
require('dotenv').config();
console.log('JWT_SECRET:', process.env.JWT_SECRET);
const express = require('express');
const connectToDatabase = require('./database'); // Function to connect to your database
const setupAuthRoutes = require('./authRoutes'); // Setup function from authRoutes.js
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001; // Use a single PORT variable

app.use(express.json());
app.use(cors());

// Establish the database connection
connectToDatabase()
  .then(db => {
    app.use('/', setupAuthRoutes(db)); // Use the router returned by setupAuthRoutes
    
    // Listen for incoming requests
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(error => {
    console.error('Failed to connect to the database:', error);
  });
