const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Middleware
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/student');

// Schema & Model
const studentSchema = new mongoose.Schema({
  Name: String,
  Roll_No: Number,
  WAD_Marks: Number,
  CC_Marks: Number,
  DSBDA_Marks: Number,
  CNS_Marks: Number,
  AI_Marks: Number,
});

const Student = mongoose.model('StudentMarks', studentSchema);

// (c) Insert sample data
app.get('/init', async (req, res) => {
  await Student.insertMany([
    { Name: 'ABC', Roll_No: 111, WAD_Marks: 25, CC_Marks: 25, DSBDA_Marks: 25, CNS_Marks: 25, AI_Marks: 25 },
    { Name: 'XYZ', Roll_No: 112, WAD_Marks: 10, CC_Marks: 15, DSBDA_Marks: 30, CNS_Marks: 35, AI_Marks: 28 },
    { Name: 'PQR', Roll_No: 113, WAD_Marks: 27, CC_Marks: 26, DSBDA_Marks: 29, CNS_Marks: 25, AI_Marks: 26 },
    { Name: 'LMN', Roll_No: 114, WAD_Marks: 15, CC_Marks: 22, DSBDA_Marks: 19, CNS_Marks: 18, AI_Marks: 17 },
  ]);
  res.send('Inserted sample students');
});

// (d + j) List all with count
app.get('/students', async (req, res) => {
  const students = await Student.find();
  const count = await Student.countDocuments();
  res.json({ count, students });
});

// (e) List students with >20 in DSBDA
app.get('/students/dsbda/above20', async (req, res) => {
  const students = await Student.find({ DSBDA_Marks: { $gt: 20 } });
  res.json(students);
});

// (f) Update marks of a student by name (adds +10 to all subjects)
app.put('/students/update/:name', async (req, res) => {
  const student = await Student.findOne({ Name: req.params.name });
  if (student) {
    student.WAD_Marks += 10;
    student.CC_Marks += 10;
    student.DSBDA_Marks += 10;
    student.CNS_Marks += 10;
    student.AI_Marks += 10;
    await student.save();
    res.json({ message: 'Marks updated', student });
  } else {
    res.status(404).json({ message: 'Student not found' });
  }
});

// (g) Students with >25 in all subjects
app.get('/students/allabove25', async (req, res) => {
  const students = await Student.find({
    WAD_Marks: { $gt: 25 },
    CC_Marks: { $gt: 25 },
    DSBDA_Marks: { $gt: 25 },
    CNS_Marks: { $gt: 25 },
    AI_Marks: { $gt: 25 },
  });
  res.json(students);
});

// (h) Students with <40 in both WAD & CNS
app.get('/students/below40mathsci', async (req, res) => {
  const students = await Student.find({
    WAD_Marks: { $lt: 40 },
    CNS_Marks: { $lt: 40 },
  });
  res.json(students);
});

// (i) Delete student by name
app.delete('/students/:name', async (req, res) => {
  const result = await Student.deleteOne({ Name: req.params.name });
  res.json({ message: 'Student deleted if found', result });
});

// Server
app.listen(3000, () => console.log('Server running at http://localhost:3000'));