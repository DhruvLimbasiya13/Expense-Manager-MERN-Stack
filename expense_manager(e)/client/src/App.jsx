import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchData } from "./services/api"; // Import the API service

import Login from "./pages/Login";
import Navbar from "./components/Navbar";
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

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("expensify_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Initialize state with empty arrays (Waiting for API)
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [peoples, setPeoples] = useState([]);
  const [users, setUsers] = useState([]); // State for Users

  // --- FETCH REAL DATA FROM DB ---
  useEffect(() => {
    if (currentUser) {
      const loadData = async () => {
        try {
          // Fetch everything in parallel
          // We added fetchData("/auth") to get the list of users
          const [exp, inc, proj, cat, sub, ppl, allUsers] = await Promise.all([
            fetchData("/expenses"),
            fetchData("/incomes"),
            fetchData("/projects"),
            fetchData("/categories"),
            fetchData("/subcategories"),
            fetchData("/peoples"),
            fetchData("/auth"), // <--- NEW: Fetch Users from backend
          ]);

          setExpenses(exp);
          setIncomes(inc);
          setProjects(proj);
          setCategories(cat);
          setSubCategories(sub);
          setPeoples(ppl);
          setUsers(allUsers); // <--- FIX: This solves the "unused" error
        } catch (error) {
          console.error("Failed to load data:", error);
        }
      };
      loadData();
    }
  }, [currentUser]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem("expensify_user", JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("expensify_user");
    setExpenses([]);
    setIncomes([]);
    setUsers([]);
  };

  // If not logged in, show Login page
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
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
              users={users} // Pass dynamic users to Dashboard
              currentUser={currentUser}
            />
          }
        />

        {/* Expenses */}
        <Route
          path="/expenses"
          element={
            <ExpenseList
              expenses={expenses}
              projects={projects}
              categories={categories}
              currentUser={currentUser}
              users={users} // Pass dynamic users to ExpenseList
            />
          }
        />
        <Route
          path="/expenses/add"
          element={
            <ExpenseAdd
              expenses={expenses}
              setExpenses={setExpenses}
              categories={categories}
              subCategories={subCategories}
              projects={projects}
              peoples={peoples}
              currentUser={currentUser}
            />
          }
        />
        <Route
          path="/expenses/edit/:id"
          element={
            <ExpenseEdit
              expenses={expenses}
              setExpenses={setExpenses}
              projects={projects}
              categories={categories}
              subCategories={subCategories}
            />
          }
        />

        {/* Incomes */}
        <Route
          path="/income"
          element={
            <IncomeList
              incomes={incomes}
              projects={projects}
              categories={categories}
              currentUser={currentUser}
            />
          }
        />
        <Route
          path="/income/add"
          element={
            <IncomeAdd
              incomes={incomes}
              setIncomes={setIncomes}
              categories={categories}
              subCategories={subCategories}
              projects={projects}
              peoples={peoples}
              currentUser={currentUser}
            />
          }
        />
        <Route
          path="/income/edit/:id"
          element={
            <IncomeEdit
              incomes={incomes}
              setIncomes={setIncomes}
              projects={projects}
              categories={categories}
              subCategories={subCategories}
            />
          }
        />

        {/* Projects */}
        <Route path="/projects" element={<ProjectList projects={projects} />} />
        <Route
          path="/projects/add"
          element={<ProjectAdd projects={projects} setProjects={setProjects} />}
        />
        <Route
          path="/projects/:id"
          element={
            <ProjectDetails
              projects={projects}
              expenses={expenses}
              incomes={incomes}
              categories={categories}
            />
          }
        />

        {/* Categories */}
        <Route
          path="/categories"
          element={
            <CategoryList
              categories={categories}
              expenses={expenses}
              incomes={incomes}
              currentUser={currentUser}
            />
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;