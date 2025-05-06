const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/music');

// Schema & Model
const songSchema = new mongoose.Schema({
  Songname: String,
  Film: String,
  Music_director: String,
  Singer: String,
  Actor: String,
  Actress: String
});

const Song = mongoose.model('SongDetails', songSchema);

// (c) Insert 5 songs
app.get('/init', async (req, res) => {
  await Song.insertMany([
    { Songname: 'Kal Ho Na Ho', Film: 'KHNH', Music_director: 'Shankar', Singer: 'Sonu Nigam' },
    { Songname: 'Tum Hi Ho', Film: 'Aashiqui 2', Music_director: 'Mithoon', Singer: 'Arijit Singh' },
    { Songname: 'Chaiyya Chaiyya', Film: 'Dil Se', Music_director: 'AR Rahman', Singer: 'Sukhwinder Singh' },
    { Songname: 'Tera Ban Jaunga', Film: 'Kabir Singh', Music_director: 'Akhil', Singer: 'Tulsi Kumar' },
    { Songname: 'Zingaat', Film: 'Sairat', Music_director: 'Ajay-Atul', Singer: 'Ajay Gogavale' }
  ]);
  res.send('Inserted sample songs');
});

// (d+k) List all songs with count
app.get('/songs', async (req, res) => {
  const songs = await Song.find();
  const count = await Song.countDocuments();
  res.json({ count, songs });
});

// (e) List songs by Music Director
app.get('/songs/director/:name', async (req, res) => {
  const songs = await Song.find({ Music_director: req.params.name });
  res.json(songs);
});

// (f) List songs by Music Director & Singer
app.get('/songs/director/:director/singer/:singer', async (req, res) => {
  const songs = await Song.find({
    Music_director: req.params.director,
    Singer: req.params.singer
  });
  res.json(songs);
});

// (g) Delete a song by name
app.delete('/songs/:name', async (req, res) => {
  const result = await Song.deleteOne({ Songname: req.params.name });
  res.json({ msg: "Deleted if existed", result });
});

// (h) Add a favourite song
app.post('/songs', async (req, res) => {
  const { Songname, Film, Music_director, Singer } = req.body;
  const song = await Song.create({ Songname, Film, Music_director, Singer });
  res.json({ msg: "Song added", song });
});

// (i) Songs by specified singer from specified film
app.get('/songs/film/:film/singer/:singer', async (req, res) => {
  const songs = await Song.find({ Film: req.params.film, Singer: req.params.singer });
  res.json(songs);
});

// (j) Add Actor & Actress to a song
app.put('/songs/update/:name', async (req, res) => {
  const updated = await Song.findOneAndUpdate(
    { Songname: req.params.name },
    { Actor: "Shahrukh Khan", Actress: "Preity Zinta" },
    { new: true }
  );
  res.json({ msg: "Updated", updated });
});

// Start server
app.listen(3000, () => console.log('Server running at http://localhost:3000'));