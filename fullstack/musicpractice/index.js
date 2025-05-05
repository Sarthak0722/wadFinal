const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/music', { useNewUrlParser: true, useUnifiedTopology: true });

const songSchema = new mongoose.Schema({
    Songname: String,
    Film: String,
    Music_director: String,
    Singer: String,
    Actor: String,
    Actress: String
});

const Song = mongoose.model('songdetails', songSchema);

// c) Insert 5 song documents (only once)
app.get('/insert', async (req, res) => {
    const count = await Song.countDocuments();
    if (count === 0) {
        await Song.insertMany([
            { Songname: "Tum Hi Ho", Film: "Aashiqui 2", Music_director: "Mithoon", Singer: "Arijit Singh" },
            { Songname: "Kal Ho Naa Ho", Film: "Kal Ho Naa Ho", Music_director: "Shankar-Ehsaan-Loy", Singer: "Sonu Nigam" },
            { Songname: "Chaiyya Chaiyya", Film: "Dil Se", Music_director: "A. R. Rahman", Singer: "Sukhwinder Singh" },
            { Songname: "Jai Ho", Film: "Slumdog Millionaire", Music_director: "A. R. Rahman", Singer: "Sukhwinder Singh" },
            { Songname: "Tera Ban Jaunga", Film: "Kabir Singh", Music_director: "Akhil Sachdeva", Singer: "Akhil Sachdeva" }
        ]);
    }
    res.send("5 songs inserted.");
});

// d) Display total count and all documents
app.get('/songs', async (req, res) => {
    const songs = await Song.find();
    const count = songs.length;

    let html = `<h2>Total Songs: ${count}</h2><table border="1"><tr><th>Song Name</th><th>Film</th><th>Music Director</th><th>Singer</th><th>Actor</th><th>Actress</th></tr>`;
    songs.forEach(song => {
        html += `<tr><td>${song.Songname}</td><td>${song.Film}</td><td>${song.Music_director}</td><td>${song.Singer}</td><td>${song.Actor || ""}</td><td>${song.Actress || ""}</td></tr>`;
    });
    html += `</table>`;
    res.send(html);
});

// e) List songs by Music Director
app.get('/music-director/:name', async (req, res) => {
    const songs = await Song.find({ Music_director: req.params.name });
    res.json(songs);
});

// f) List songs by Music Director and Singer
app.get('/filter', async (req, res) => {
    const { director, singer } = req.query;
    const songs = await Song.find({ Music_director: director, Singer: singer });
    res.json(songs);
});

// g) Delete a song
app.delete('/delete', async (req, res) => {
    const { name } = req.body;
    await Song.deleteOne({ Songname: name });
    res.send(`Song "${name}" deleted.`);
});

// h) Add a favorite song
app.post('/add', async (req, res) => {
    const { Songname, Film, Music_director, Singer } = req.body;
    await Song.create({ Songname, Film, Music_director, Singer });
    res.send("New song added.");
});

// i) List songs by Singer from Film
app.get('/film-singer', async (req, res) => {
    const { film, singer } = req.query;
    const songs = await Song.find({ Film: film, Singer: singer });
    res.json(songs);
});

// j) Update document to add Actor and Actress
app.put('/update', async (req, res) => {
    const { Songname, Actor, Actress } = req.body;
    await Song.updateOne({ Songname }, { $set: { Actor, Actress } });
    res.send("Actor and Actress added.");
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
