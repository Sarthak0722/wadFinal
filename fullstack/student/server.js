// server.js
const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.static('public'));

const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbName = 'student';

let collection;

client.connect().then(() => {
    const db = client.db(dbName);
    collection = db.collection('studentmarks');
    console.log("Connected to MongoDB");
}).catch(err => console.error(err));

// c) Insert documents
app.get('/insert', async (req, res) => {
    const data = [
        { Name: 'Alice', Roll_No: 1, WAD_Marks: 26, CC_Marks: 30, DSBDA_Marks: 28, CNS_Marks: 25, AI_Marks: 29 },
        { Name: 'Bob', Roll_No: 2, WAD_Marks: 22, CC_Marks: 21, DSBDA_Marks: 18, CNS_Marks: 20, AI_Marks: 24 },
        { Name: 'Charlie', Roll_No: 3, WAD_Marks: 27, CC_Marks: 26, DSBDA_Marks: 30, CNS_Marks: 28, AI_Marks: 26 },
        { Name: 'David', Roll_No: 4, WAD_Marks: 15, CC_Marks: 18, DSBDA_Marks: 19, CNS_Marks: 17, AI_Marks: 20 },
        { Name: 'Eve', Roll_No: 5, WAD_Marks: 29, CC_Marks: 28, DSBDA_Marks: 27, CNS_Marks: 26, AI_Marks: 30 }
    ];
    await collection.insertMany(data);
    res.send('Data inserted!');
});

// d) Count & list all documents
app.get('/all', async (req, res) => {
    const allDocs = await collection.find().toArray();
    const count = await collection.countDocuments();
    res.json({ count, allDocs });
});

// e) Students with DSBDA marks > 20
app.get('/dsbda20', async (req, res) => {
    const result = await collection.find({ DSBDA_Marks: { $gt: 20 } }, { projection: { Name: 1, _id: 0 } }).toArray();
    res.json(result);
});

// f) Update marks of a student (increase all by 10)
app.put('/update/:name', async (req, res) => {
    const name = req.params.name;
    await collection.updateOne({ Name: name }, {
        $inc: {
            WAD_Marks: 10, CC_Marks: 10,
            DSBDA_Marks: 10, CNS_Marks: 10,
            AI_Marks: 10
        }
    });
    res.send("Marks updated");
});

// g) Students with > 25 in all subjects
app.get('/all25', async (req, res) => {
    const result = await collection.find({
        WAD_Marks: { $gt: 25 },
        CC_Marks: { $gt: 25 },
        DSBDA_Marks: { $gt: 25 },
        CNS_Marks: { $gt: 25 },
        AI_Marks: { $gt: 25 }
    }).project({ Name: 1, _id: 0 }).toArray();
    res.json(result);
});

// h) Students with < 40 in both Maths and Science (assume WAD and CNS)
app.get('/lowmathscience', async (req, res) => {
    const result = await collection.find({
        WAD_Marks: { $lt: 40 },
        CNS_Marks: { $lt: 40 }
    }).project({ Name: 1, _id: 0 }).toArray();
    res.json(result);
});

// i) Remove specified student
app.delete('/remove/:name', async (req, res) => {
    const name = req.params.name;
    await collection.deleteOne({ Name: name });
    res.send("Student removed");
});

// j) Display all in browser table
app.get('/display', async (req, res) => {
    const students = await collection.find().toArray();
    let table = `<table border='1'><tr><th>Name</th><th>Roll No</th><th>WAD</th><th>CC</th><th>DSBDA</th><th>CNS</th><th>AI</th></tr>`;
    students.forEach(s => {
        table += `<tr><td>${s.Name}</td><td>${s.Roll_No}</td><td>${s.WAD_Marks}</td><td>${s.CC_Marks}</td><td>${s.DSBDA_Marks}</td><td>${s.CNS_Marks}</td><td>${s.AI_Marks}</td></tr>`;
    });
    table += '</table>';
    res.send(table);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
