const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/bookstore');

// Schema & Model
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  price: Number,
  genre: String
});

const Book = mongoose.model('Book', bookSchema);

// 📌 Add 5 books using GET (for your requirement)
app.get('/init-books', async (req, res) => {
  await Book.insertMany([
    { title: 'The Alchemist', author: 'Paulo Coelho', price: 299, genre: 'Fiction' },
    { title: 'Atomic Habits', author: 'James Clear', price: 499, genre: 'Self-help' },
    { title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki', price: 399, genre: 'Finance' },
    { title: 'Clean Code', author: 'Robert C. Martin', price: 799, genre: 'Programming' },
    { title: 'The Subtle Art of Not Giving a F*ck', author: 'Mark Manson', price: 350, genre: 'Self-help' },
  ]);
  res.send('Inserted 5 sample books');
});

// 📌 Retrieve all books
app.get('/books', async (req, res) => {
  const books = await Book.find();
  res.json({ count: books.length, books });
});

// 📌 Update a book by ID
app.put('/books/update/:id', async (req, res) => {
  const updated = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (updated) {
    res.json({ message: 'Book updated', updated });
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// 📌 Delete a book by ID
app.delete('/books/:id', async (req, res) => {
  const deleted = await Book.findByIdAndDelete(req.params.id);
  if (deleted) {
    res.json({ message: 'Book deleted', deleted });
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// Start server
app.listen(3000, () => console.log('Server running at http://localhost:3000'));
