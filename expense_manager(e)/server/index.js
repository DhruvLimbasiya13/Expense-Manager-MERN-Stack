const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// 1. Load Environment Variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 2. Enable CORS (Allows connection from React Frontend)
app.use(cors({
    origin: "http://localhost:5173", // Your React App URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json()); // Parses incoming JSON requests

// 3. Database Connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

const authRoute = require('./routes/auth');
const peopleRoute = require('./routes/peoples');
const projectRoute = require('./routes/projects');
const categoryRoute = require('./routes/categories');
const subCategoryRoute = require('./routes/subcategories');
const expenseRoute = require('./routes/expenses');
const incomeRoute = require('./routes/incomes');

// 5. Use Routes
// These define the API endpoints (e.g., http://localhost:3000/api/expenses)
app.use('/api/auth', authRoute);
app.use('/api/peoples', peopleRoute); // API endpoint for employees
app.use('/api/projects', projectRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/subcategories', subCategoryRoute);
app.use('/api/expenses', expenseRoute);
app.use('/api/incomes', incomeRoute);

// 6. Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});