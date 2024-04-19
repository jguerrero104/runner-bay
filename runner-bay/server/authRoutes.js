require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const authenticateToken = require('./authenticateToken');

const setupAuthRoutes = (db) => {
  const router = express.Router();
  
  // Apply some basic security measures
  router.use(helmet());


  // Registration endpoint
  router.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    // Basic input validation
    if (!email || !password || !username) {
      return res.status(400).json({ message: 'Username, email, and password are required.' });
    }
  
    try {
      // Check if the email or username already exists
      const existingUser = await db.query(
        'SELECT * FROM users WHERE email = ? OR username = ?',
        [email, username]
      );
  
      if (existingUser.length) {
        // Check which attribute already exists and return a specific message
        const isEmailTaken = existingUser.some(user => user.email === email);
        const isUsernameTaken = existingUser.some(user => user.username === username);
  
        if (isEmailTaken && isUsernameTaken) {
          return res.status(409).json({ message: 'Both email and username are already taken.' });
        } else if (isEmailTaken) {
          return res.status(409).json({ message: 'Email is already taken.' });
        } else if (isUsernameTaken) {
          return res.status(409).json({ message: 'Username is already taken.' });
        }
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', 
        [username, email, hashedPassword, 'regular']
      );
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Registration failed due to an internal error.' });
    }
  });

  // Login endpoint
  router.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const user = users[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, id: user.id, role: user.role });  // Include role in the response
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed due to an internal error.' });
    }
});


  // Protected route example: Get user profile
  // router.get('/api/user/profile', authenticateToken, async (req, res) => {
  //   try {
  //     const [user] = await db.query('SELECT username, email, role FROM users WHERE id = ?', [req.user.userId]);
  //     if (user.length === 0) {
  //       return res.status(404).json({ message: 'User not found.' });
  //     }

  //     res.json(user[0]);
  //   } catch (error) {
  //     console.error('Error accessing profile:', error);
  //     res.status(500).json({ message: 'Failed to access user profile.' });
  //   }
  // });

  return router;
};

module.exports = setupAuthRoutes;
