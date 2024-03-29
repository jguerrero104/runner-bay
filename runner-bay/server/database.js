const mysql = require('mysql2/promise');

async function connectToDatabase() {
  try {
    const db = await mysql.createConnection({
      host: 'runner-bay-db.cbmmisgs8f96.us-east-2.rds.amazonaws.com',
      user: 'admin',
      password: 'runnerbay123',
      database: 'runner-bay'
    });

    console.log('Connected to MySQL database');
    return db;
  } catch (error) {
    console.error('Error connecting to MySQL:', error);
    throw error;
  }
}

module.exports = connectToDatabase;
