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

////////////////////////////////////////////////////////////////////////
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
// Register a borrower
app.post('/borrowers', async (req, res) => {
    const { name, email, registered_date } = req.body;

    try {
        const { rows } = await pool.query(
            'INSERT INTO borrowers (name, email, registered_date) VALUES ($1, $2, $3) RETURNING *',
            [name, email, registered_date]
        );

        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update borrower's details
app.put('/borrowers/:id', async (req, res) => {
    const borrowerId = req.params.id;
    const { name, email, registered_date } = req.body;

    try {
        const { rows } = await pool.query(
            'UPDATE borrowers SET name=$1, email=$2, registered_date=$3 WHERE id=$4 RETURNING *',
            [name, email, registered_date, borrowerId]
        );

        if (rows.length === 0) {
            res.status(404).json({ error: 'Borrower not found' });
        } else {
            res.json(rows[0]);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a borrower
app.delete('/borrowers/:id', async (req, res) => {
    const borrowerId = req.params.id;

    try {
        const { rows } = await pool.query('DELETE FROM borrowers WHERE id=$1 RETURNING *', [borrowerId]);

        if (rows.length === 0) {
            res.status(404).json({ error: 'Borrower not found' });
        } else {
            res.json({ message: 'Borrower deleted successfully' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//////////////////////////////////////////////////////////////////////////////////
// Borrowing process 


// Check out a book
app.post('/borrowings', async (req, res) => {
    const { book_id, borrower_id } = req.body;

    const borrow_date = new Date();
    const due_date = new Date();
    due_date.setDate(borrow_date.getDate() + 14); // here we assuming a 14-day borrowing period

    try {
        const { rows } = await pool.query(
            'INSERT INTO borrowings (book_id, borrower_id, borrow_date, due_date) VALUES ($1, $2, $3, $4) RETURNING *',
            [book_id, borrower_id, borrow_date, due_date]
        );

        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Return a book
app.put('/borrowings/:id', async (req, res) => {
    const borrowingId = req.params.id;

    try {
        const { rows } = await pool.query('DELETE FROM borrowings WHERE id=$1 RETURNING *', [borrowingId]);

        if (rows.length === 0) {
            res.status(404).json({ error: 'Borrowing not found' });
        } else {
            res.json({ message: 'Book returned successfully' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// List books currently borrowed by a borrower
app.get('/borrowings/borrower/:borrowerId', async (req, res) => {
    const borrowerId = req.params.borrowerId;

    try {
        const { rows } = await pool.query(
            'SELECT b.*, br.borrow_date, br.due_date FROM books b JOIN borrowings br ON b.id = br.book_id WHERE br.borrower_id=$1',
            [borrowerId]
        );

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// List overdue books
app.get('/borrowings/overdue', async (req, res) => {
    const currentDate = new Date();

    try {
        const { rows } = await pool.query(
            'SELECT b.*, br.borrow_date, br.due_date FROM books b JOIN borrowings br ON b.id = br.book_id WHERE br.due_date < $1',
            [currentDate]
        );

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});