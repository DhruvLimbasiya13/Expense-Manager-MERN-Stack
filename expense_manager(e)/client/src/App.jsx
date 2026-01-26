import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchData } from "./services/api"; // Import API Service

// Pages & Components
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import ProjectList from "./pages/ProjectList";
import ProjectAdd from "./pages/ProjectAdd";
import ProjectDetails from "./pages/ProjectDetails";
import ExpenseList from "./pages/ExpenseList";
import ExpenseAdd from "./pages/ExpenseAdd";
import IncomeList from "./pages/IncomeList";
import IncomeAdd from "./pages/IncomeAdd";
import CategoryList from "./pages/CategoryList";

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("expensify_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [peoples, setPeoples] = useState([]);

  // Fetch Data from Backend
  useEffect(() => {
    if (currentUser) {
      const loadData = async () => {
        const [exp, inc, proj, cat, sub, ppl] = await Promise.all([
          fetchData('/expenses'),
          fetchData('/incomes'),
          fetchData('/projects'),
          fetchData('/categories'),
          fetchData('/subcategories'),
          fetchData('/peoples')
        ]);
        setExpenses(exp); setIncomes(inc); setProjects(proj);
        setCategories(cat); setSubCategories(sub); setPeoples(ppl);
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
    setExpenses([]); setIncomes([]);
  };

  if (!currentUser) return <Login onLogin={handleLogin} />;

  return (
    <BrowserRouter>
      <Navbar currentUser={currentUser} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Dashboard expenses={expenses} incomes={incomes} projects={projects} />} />
        
        <Route path="/projects" element={<ProjectList projects={projects} />} />
        <Route path="/projects/add" element={<ProjectAdd projects={projects} setProjects={setProjects} currentUser={currentUser} />} />
        <Route path="/projects/:id" element={<ProjectDetails projects={projects} expenses={expenses} incomes={incomes} categories={categories} />} />

        <Route path="/expenses" element={<ExpenseList expenses={expenses} projects={projects} categories={categories} currentUser={currentUser} />} />
        <Route path="/expenses/add" element={<ExpenseAdd expenses={expenses} setExpenses={setExpenses} projects={projects} categories={categories} subCategories={subCategories} peoples={peoples} currentUser={currentUser} />} />

        <Route path="/income" element={<IncomeList incomes={incomes} projects={projects} categories={categories} currentUser={currentUser} />} />
        <Route path="/income/add" element={<IncomeAdd incomes={incomes} setIncomes={setIncomes} projects={projects} categories={categories} subCategories={subCategories} peoples={peoples} currentUser={currentUser} />} />
        
        <Route path="/categories" element={<CategoryList categories={categories} expenses={expenses} incomes={incomes} currentUser={currentUser} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;