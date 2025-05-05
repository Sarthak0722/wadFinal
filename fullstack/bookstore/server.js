// server.js
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const port = 3000;

app.use(express.json());

// MongoDB Connection
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbName = 'online_bookstore';

let booksCollection;

client.connect().then(() => {
  const db = client.db(dbName);
  booksCollection = db.collection('books');
  console.log('✅ Connected to MongoDB');
}).catch(err => console.error('❌ MongoDB Connection Failed:', err));

/* ➕ Add a New Book */
app.post('/books', async (req, res) => {
  const { title, author, price, genre } = req.body;
  await booksCollection.insertOne({ title, author, price, genre });
  res.send('✅ Book added successfully');
});

/* 📚 Get All Books */
app.get('/books', async (req, res) => {
  const books = await booksCollection.find().toArray();
  res.json(books);
});

/* ✏️ Update Book by ID */
app.put('/books/:id', async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  await booksCollection.updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
  res.send('✅ Book updated successfully');
});

/* ❌ Delete Book by ID */
app.delete('/books/:id', async (req, res) => {
  const id = req.params.id;
  await booksCollection.deleteOne({ _id: new ObjectId(id) });
  res.send('🗑️ Book deleted successfully');
});

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
