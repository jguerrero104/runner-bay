const express = require('express');
const bcrypt = require('bcrypt');
const db = require('./database'); // Import your database connection module
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Registration endpoint
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
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
