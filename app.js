const express = require('express');
const app = express();
const { Pool } = require('pg');
const config = require('./config');

const pool = new Pool(config.db);
app.use(express.json());
// Define a route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Library Management System');
  });
  
  // Define the "/books" route as you have already done
  app.get('/books', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM books');
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });