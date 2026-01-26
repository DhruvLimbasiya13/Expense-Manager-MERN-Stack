const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- STEP 1: ENABLE CORS ---
app.use(cors({
    origin: "http://localhost:5173", // Allow your React App
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.log(err));

// Import Routes
const authRoute = require('./routes/auth');
const peopleRoute = require('./routes/peoples');
const expenseRoute = require('./routes/expenses');
const incomeRoute = require('./routes/incomes');
const projectRoute = require('./routes/projects');
const categoryRoute = require('./routes/categories');
const subCategoryRoute = require('./routes/subcategories');

// Use Routes
app.use('/api/auth', authRoute);
app.use('/api/peoples', peopleRoute);
app.use('/api/expenses', expenseRoute);
app.use('/api/incomes', incomeRoute);
app.use('/api/projects', projectRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/subcategories', subCategoryRoute);

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});