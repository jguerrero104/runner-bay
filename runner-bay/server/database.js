const mysql = require('mysql2/promise');
require('dotenv').config();

async function connectToDatabase() {
  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('Connected to MySQL database');
    return db;
  } catch (error) {
    console.error('Error connecting to MySQL:', error);
    throw error;
  }
}

module.exports = connectToDatabase;
