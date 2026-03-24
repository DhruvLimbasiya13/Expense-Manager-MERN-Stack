const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json()); // Parses incoming JSON requests


mongoose.connect(process.env.MONGO_URL, {
    serverSelectionTimeoutMS: 5000,
})
    .then(async () => {
        console.log('✅ MongoDB Connected');
        try {
            const User = require('./models/User.model');
            const Project = require('./models/Project.model');
            const Category = require('./models/Category.model');
            const People = require('./models/People.model');
            const Income = require('./models/Income.model');
            const Expense = require('./models/Expense.model');

            const user = await User.findOne();
            if (user) {
                // Determine if we need to seed (e.g. if projects < 6)
                const projectCount = await Project.countDocuments({ userID: user._id });
                if (projectCount < 6) {
                    console.log('Seeding dummy data...');
                    const people = await People.create({ peopleName: 'Dummy Employee', email: 'dummy@employee.com', password: 'password123', mobileNo: '9876543210', userID: user._id });
                    const catIncome = await Category.create({ categoryName: 'Sales Dummy', isIncome: true, isExpense: false, userID: user._id });
                    const catExpense = await Category.create({ categoryName: 'Software Dummy', isIncome: false, isExpense: true, userID: user._id });

                    const proj1 = await Project.create({ projectName: 'Website Redesign', userID: user._id, description: 'Corporate website update' });
                    const proj2 = await Project.create({ projectName: 'Mobile App', userID: user._id, description: 'iOS and Android App' });
                    const proj3 = await Project.create({ projectName: 'Marketing Q1', userID: user._id, description: 'Q1 Marketing Campaign' });
                    const proj4 = await Project.create({ projectName: 'Cloud Migration', userID: user._id, description: 'AWS to GCP' });
                    const proj5 = await Project.create({ projectName: 'AI Integration', userID: user._id, description: 'Adding LLMs to products' });
                    const proj6 = await Project.create({ projectName: 'Data Analytics', userID: user._id, description: 'Internal dashboard' });

                    await Income.create([
                        { incomeDate: new Date(), amount: 50000, categoryID: catIncome._id, projectID: proj1._id, peopleID: people._id, userID: user._id, description: 'Initial Deposit' },
                        { incomeDate: new Date(), amount: 75000, categoryID: catIncome._id, projectID: proj2._id, peopleID: people._id, userID: user._id, description: 'Milestone 1' },
                        { incomeDate: new Date(), amount: 15000, categoryID: catIncome._id, projectID: proj3._id, peopleID: people._id, userID: user._id, description: 'Ad Revenue' },
                        { incomeDate: new Date(), amount: 100000, categoryID: catIncome._id, projectID: proj4._id, peopleID: people._id, userID: user._id, description: 'Budget Allocation' },
                        { incomeDate: new Date(), amount: 250000, categoryID: catIncome._id, projectID: proj5._id, peopleID: people._id, userID: user._id, description: 'Seed Funding' },
                        { incomeDate: new Date(), amount: 40000, categoryID: catIncome._id, projectID: proj6._id, peopleID: people._id, userID: user._id, description: 'Internal Budget' }
                    ]);

                    await Expense.create([
                        { expenseDate: new Date(), amount: 12000, categoryID: catExpense._id, projectID: proj1._id, peopleID: people._id, userID: user._id, description: 'Design Tools' },
                        { expenseDate: new Date(), amount: 5000, categoryID: catExpense._id, projectID: proj1._id, peopleID: people._id, userID: user._id, description: 'Hosting' },
                        { expenseDate: new Date(), amount: 35000, categoryID: catExpense._id, projectID: proj2._id, peopleID: people._id, userID: user._id, description: 'Dev Servers' },
                        { expenseDate: new Date(), amount: 8000, categoryID: catExpense._id, projectID: proj3._id, peopleID: people._id, userID: user._id, description: 'Ads' },
                        { expenseDate: new Date(), amount: 65000, categoryID: catExpense._id, projectID: proj4._id, peopleID: people._id, userID: user._id, description: 'GCP Credits' },
                        { expenseDate: new Date(), amount: 120000, categoryID: catExpense._id, projectID: proj5._id, peopleID: people._id, userID: user._id, description: 'GPU compute' },
                        { expenseDate: new Date(), amount: 15000, categoryID: catExpense._id, projectID: proj6._id, peopleID: people._id, userID: user._id, description: 'BI License' }
                    ]);
                    console.log('Dummy data seeded successfully!');
                }
            }
        } catch (e) { console.error('Seeding error', e); }
    })
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err.message);
        console.error('Check your MongoDB Atlas IP Whitelist. Allow 0.0.0.0/0');
    });

const authRoute = require('./routes/auth');
const peopleRoute = require('./routes/peoples');
const projectRoute = require('./routes/projects');
const categoryRoute = require('./routes/categories');
const subCategoryRoute = require('./routes/subcategories');
const expenseRoute = require('./routes/expenses');
const incomeRoute = require('./routes/incomes');


// These define the API endpoints (e.g., http://localhost:3000/api/expenses)
app.use('/api/auth', authRoute);
app.use('/api/peoples', peopleRoute);
app.use('/api/projects', projectRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/subcategories', subCategoryRoute);
app.use('/api/expenses', expenseRoute);
app.use('/api/incomes', incomeRoute);

// 6. Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});