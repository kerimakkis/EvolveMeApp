const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

console.log('MONGO_URI:', process.env.MONGO_URI);


const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/habits', require('./routes/habits'));
app.use('/api/journal', require('./routes/journal'));

app.get('/', (req, res) => res.send('EvolveMe API Running'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));