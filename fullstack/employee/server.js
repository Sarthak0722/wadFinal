const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/employees');

// Schema & Model
const employeeSchema = new mongoose.Schema({
  name: String,
  department: String,
  designation: String,
  salary: Number,
  joiningDate: Date
});

const Employee = mongoose.model('Employee', employeeSchema);

// 📌 Add a new employee
app.post('/employees', async (req, res) => {
  const employee = await Employee.create(req.body);
  res.json({ message: 'Employee added', employee });
});

// 📌 View all employee records
app.get('/employees', async (req, res) => {
  const employees = await Employee.find();
  res.json({ count: employees.length, employees });
});

// 📌 Update an existing employee’s details by ID
app.put('/employees/:id', async (req, res) => {
  const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (updated) {
    res.json({ message: 'Employee updated', updated });
  } else {
    res.status(404).json({ message: 'Employee not found' });
  }
});

// 📌 Delete an employee by ID
app.delete('/employees/:id', async (req, res) => {
  const result = await Employee.findByIdAndDelete(req.params.id);
  if (result) {
    res.json({ message: 'Employee deleted', result });
  } else {
    res.status(404).json({ message: 'Employee not found' });
  }
});

// Start server
app.listen(3000, () => console.log('Server running at http://localhost:3000'));
