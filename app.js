// app.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 9000;

app.use(bodyParser.json());
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Create a connection to the MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'viraj',
  password: 'viraj2000',
  database: 'school'
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    throw err;
  }
  console.log('Connected to MySQL!');
});

// Create a table with columns 'id' and 'name' if not exists
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
  )
`;

db.query(createTableQuery, (err, result) => {
  if (err) {
    console.error('Error creating table:', err);
    throw err;
  }
  console.log('Table created or already exists.');
});

// Insert a new user into the database
app.post('/users', (req, res) => {
  const { name } = req.body;

  const insertDataQuery = 'INSERT INTO users (name) VALUES (?)';

  db.query(insertDataQuery, [name], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    console.log('User added successfully');
    res.sendStatus(200);
  });
});

// Retrieve data from the database
app.get('/users', (req, res) => {
  const selectDataQuery = 'SELECT * FROM users';
  db.query(selectDataQuery, (err, result) => {
    if (err) {
      console.error('Error selecting data:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(result);
  });
});

// Serve the HTML file as the default route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
