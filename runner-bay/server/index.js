require('dotenv').config();
console.log('JWT_SECRET:', process.env.JWT_SECRET);
const express = require('express');
const connectToDatabase = require('./database'); // Function to connect to your database
const setupAuthRoutes = require('./authRoutes'); // Setup function from authRoutes.js
const LostFoundRoutes = require('./LostFoundRoutes'); // Import the LostFound routes
const listingRoutes = require('./listingRoutes'); // Import the listing routes
const profileRoutes = require('./profileRoutes');
const requestRoutes = require('./requestRoutes');
const LostRequestRoutes = require('./LostRequestRoutes');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001; // Use a single PORT variable

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads')); // Serve the uploaded images

// Establish the database connection
connectToDatabase()
  .then(db => {
    app.use('/', setupAuthRoutes(db)); // Use the router returned by setupAuthRoutes
    app.use('/', listingRoutes(db)); 
    app.use('/', profileRoutes(db)); // Include profile routes
    app.use('/', LostFoundRoutes(db)); // Include LostFound routes
    app.use('/', requestRoutes(db)); // Include request routes
    app.use('/', LostRequestRoutes(db)); // Include LostRequests routes
    
    // Listen for incoming requests
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(error => {
    console.error('Failed to connect to the database:', error);
  });
