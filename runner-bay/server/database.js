const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'runner-bay-db.cbmmisgs8f96.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: 'runnerbay123',
  database: 'runner-bay'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

module.exports = db;
