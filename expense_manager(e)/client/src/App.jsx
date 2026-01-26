import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

// --- Authentication ---
import Login from "./pages/Login";

// --- Components ---
import Navbar from "./components/Navbar";

// --- Pages ---
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

import ExpenseList from "./pages/ExpenseList";
import ExpenseAdd from "./pages/ExpenseAdd";
import ExpenseEdit from "./pages/ExpenseEdit";

import IncomeList from "./pages/IncomeList";
import IncomeAdd from "./pages/IncomeAdd";
import IncomeEdit from "./pages/IncomeEdit";

import ProjectList from "./pages/ProjectList";
import ProjectAdd from "./pages/ProjectAdd";
import ProjectDetails from "./pages/ProjectDetails";

import CategoryList from "./pages/CategoryList";

// --- Data ---
import { initialExpenses } from "./data/expenseData";
import { initialIncomes } from "./data/incomeData";
import { initialProjects } from "./data/projectData";
import { initialCategories } from "./data/categoryData";
import { initialSubCategories } from "./data/subCategoryData";
import { initialUsers } from "./data/userData"; 

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("expensify_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // --- STATE FOR USERS (To allow registration) ---
  const [users, setUsers] = useState(initialUsers);

  const [expenses, setExpenses] = useState(initialExpenses);
  const [incomes, setIncomes] = useState(initialIncomes);
  const [projects, setProjects] = useState(initialProjects || []);
  const [categories, setCategories] = useState(initialCategories || []);
  const [subCategories, setSubCategories] = useState(initialSubCategories || []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem("expensify_user", JSON.stringify(user));
  };

  // --- REGISTER HANDLER ---
  const handleRegister = (newUser) => {
    const userWithId = { ...newUser, id: Date.now(), role: 'normal_user' };
    setUsers([...users, userWithId]);
    handleLogin(userWithId); // Auto-login after register
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("expensify_user");
  };

  const handleDeleteExpense = (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      setExpenses(expenses.filter((expense) => expense.id !== id));
    }
  };

  const handleDeleteIncome = (id) => {
    if (window.confirm("Are you sure you want to delete this income record?")) {
      setIncomes(incomes.filter((income) => income.id !== id));
    }
  };

  if (!currentUser) {
    // Pass users and register handler to Login
    return <Login onLogin={handleLogin} users={users} onRegister={handleRegister} />;
  }

  return (
    <BrowserRouter>
      <Navbar currentUser={currentUser} onLogout={handleLogout} />

      <Routes>
        <Route
          path="/"
          element={
            <Dashboard
              expenses={expenses}
              incomes={incomes}
              projects={projects}
              categories={categories}
              users={users} // Pass dynamic users state
              currentUser={currentUser}
            />
          }
        />

        {/* --- Expense Routes --- */}
        <Route
          path="/expenses"
          element={
            <ExpenseList
              expenses={expenses}
              projects={projects}
              categories={categories}
              currentUser={currentUser}
              users={users} // Pass dynamic users state
              onDelete={handleDeleteExpense}
            />
          }
        />
        <Route
          path="/expenses/add"
          element={<ExpenseAdd expenses={expenses} setExpenses={setExpenses} categories={categories} setCategories={setCategories} subCategories={subCategories} setSubCategories={setSubCategories} projects={projects} currentUser={currentUser} />}
        />
        <Route 
          path="/expenses/edit/:id" 
          element={<ExpenseEdit expenses={expenses} setExpenses={setExpenses} projects={projects} categories={categories} subCategories={subCategories} />} 
        />

        {/* --- Income Routes --- */}
        <Route
          path="/income"
          element={
            <IncomeList
              incomes={incomes}
              projects={projects}
              categories={categories}
              currentUser={currentUser}
              users={users} // Pass dynamic users state
              onDelete={handleDeleteIncome}
            />
          }
        />
        <Route
          path="/income/add"
          element={<IncomeAdd incomes={incomes} setIncomes={setIncomes} categories={categories} setCategories={setCategories} subCategories={subCategories} setSubCategories={setSubCategories} projects={projects} currentUser={currentUser} />}
        />
        <Route 
          path="/income/edit/:id" 
          element={<IncomeEdit incomes={incomes} setIncomes={setIncomes} projects={projects} categories={categories} subCategories={subCategories} />} 
        />

        {/* --- Project Routes --- */}
        <Route path="/projects" element={<ProjectList projects={projects} />} />
        <Route path="/projects/add" element={<ProjectAdd projects={projects} setProjects={setProjects} />} />
        <Route path="/projects/:id" element={<ProjectDetails projects={projects} expenses={expenses} incomes={incomes} categories={categories} />} />

        {/* --- Category Routes --- */}
        <Route
          path="/categories"
          element={<CategoryList categories={categories} expenses={expenses} incomes={incomes} currentUser={currentUser} />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;