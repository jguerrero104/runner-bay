const express = require('express');
const bcrypt = require('bcrypt');
const connectToDatabase = require('./database'); // Import the function
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');

app.use(express.json());
app.use(cors());

// Establish the database connection
let db;
connectToDatabase().then(connection => {
  db = connection;
}).catch(error => {
  console.error('Failed to connect to the database:', error);
});

// Registration endpoint
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', 
      [username, email, hashedPassword, 'regular']
    );
    console.log('User registered successfully, user ID:', result.insertId);
    res.status(201).send('User registered successfully');
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).send('Registration failed');
  }
});

// Other routes can be defined here

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
