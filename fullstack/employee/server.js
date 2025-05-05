// server.js
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const port = 3000;

app.use(express.json());

const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbName = 'company';

let employeeCollection;

client.connect().then(() => {
    const db = client.db(dbName);
    employeeCollection = db.collection('employees');
    console.log('Connected to MongoDB');
}).catch(err => console.error(err));

/* ➕ Add New Employee */
app.post('/employee', async (req, res) => {
    const { name, department, designation, salary, joiningDate } = req.body;
    const employee = { name, department, designation, salary, joiningDate };
    await employeeCollection.insertOne(employee);
    res.send('Employee added successfully');
});

/* 📄 View All Employees */
app.get('/employees', async (req, res) => {
    const employees = await employeeCollection.find().toArray();
    res.json(employees);
});

/* ✏️ Update Employee by ID */
app.put('/employee/:id', async (req, res) => {
    const id = req.params.id;
    const updateData = req.body;
    await employeeCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    res.send('Employee updated successfully');
});

/* ❌ Delete Employee by ID */
app.delete('/employee/:id', async (req, res) => {
    const id = req.params.id;
    await employeeCollection.deleteOne({ _id: new ObjectId(id) });
    res.send('Employee deleted successfully');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
