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
  
  // Book Endpoints
  app.get('/books', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM books');
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


// Add a book
app.post('/books', async (req, res) => {
    const { title, author, isbn, quantity, shelf_location } = req.body;
  
    try {
      const { rows } = await pool.query(
        'INSERT INTO books (title, author, isbn, quantity, shelf_location) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [title, author, isbn, quantity, shelf_location]
      );
  
      res.status(201).json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Update a book's details
  app.put('/books/:id', async (req, res) => {
    const bookId = req.params.id;
    const { title, author, isbn, quantity, shelf_location } = req.body;
  
    try {
      const { rows } = await pool.query(
        'UPDATE books SET title=$1, author=$2, isbn=$3, quantity=$4, shelf_location=$5 WHERE id=$6 RETURNING *',
        [title, author, isbn, quantity, shelf_location, bookId]
      );
  
      if (rows.length === 0) {
        res.status(404).json({ error: 'Book not found' });
      } else {
        res.json(rows[0]);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Delete a book
  app.delete('/books/:id', async (req, res) => {
    const bookId = req.params.id;
  
    try {
      const { rows } = await pool.query('DELETE FROM books WHERE id=$1 RETURNING *', [bookId]);
  
      if (rows.length === 0) {
        res.status(404).json({ error: 'Book not found' });
      } else {
        res.json({ message: 'Book deleted successfully' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Search for a book by title, author, or ISBN
  app.get('/books/search', async (req, res) => {
    const { title, author, isbn } = req.query;
  
    try {
      const { rows } = await pool.query(
        'SELECT * FROM books WHERE title ILIKE $1 OR author ILIKE $2 OR isbn ILIKE $3',
        [`%${title}%`, `%${author}%`, `%${isbn}%`]
      );
  
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


//Borrowers Endpoints 

// List all borrowers
    app.get('/borrowers', async (req, res) => {
        try {
          const { rows } = await pool.query('SELECT * FROM borrowers');
          res.json(rows);
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal server error' });
        }
      });
  
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });