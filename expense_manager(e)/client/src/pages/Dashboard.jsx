import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard({
  expenses,
  incomes,
  projects,
  categories,
  currentUser,
  users,
}) {
  const navigate = useNavigate();

  const [selectedUser, setSelectedUser] = useState(null);

  // --- LOGIC 1: ADMIN GLOBAL VIEW CALCULATIONS ---
  const globalProjectSummary = projects.map((project) => {
    const totalProjExpenses = expenses
      .filter((e) => Number(e.projectId) === Number(project.id))
      .reduce((s, e) => s + Number(e.amount), 0);

    const totalProjIncome = incomes
      .filter((i) => Number(i.projectId) === Number(project.id))
      .reduce((s, i) => s + Number(i.amount), 0);

    return { ...project, expense: totalProjExpenses, income: totalProjIncome };
  });

  // --- LOGIC 2: INDIVIDUAL VIEW CALCULATIONS ---
  const isViewingUserList = currentUser.role === "admin" && !selectedUser;
  const targetUser = currentUser.role === "admin" ? selectedUser : currentUser;

  // Filter Data for the specific target user
  const myExpenses = targetUser
    ? expenses.filter((e) => Number(e.userId) === Number(targetUser.id))
    : [];

  const myIncomes = targetUser
    ? incomes.filter((i) => Number(i.userId) === Number(targetUser.id))
    : [];

  const totalExpense = myExpenses.reduce((s, e) => s + Number(e.amount), 0);
  const totalIncome = myIncomes.reduce((s, i) => s + Number(i.amount), 0);
  const balance = totalIncome - totalExpense;

  // Individual Project Stats
  const userProjectSummary = projects.map((project) => {
    const projExpenses = myExpenses
      .filter((e) => Number(e.projectId) === Number(project.id))
      .reduce((s, e) => s + Number(e.amount), 0);

    const projIncome = myIncomes
      .filter((i) => Number(i.projectId) === Number(project.id))
      .reduce((s, i) => s + Number(i.amount), 0);

    return { ...project, expense: projExpenses, income: projIncome };
  });

  const categoryStats = categories
    .filter((c) => c.isExpense)
    .map((cat) => {
      const total = myExpenses
        .filter((e) => Number(e.categoryId) === Number(cat.id))
        .reduce((s, e) => s + Number(e.amount), 0);
      return { name: cat.name, total };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  // =================================================================================
  // VIEW 1: ADMIN MAIN DASHBOARD (Global Projects + User List)
  // =================================================================================
  if (isViewingUserList) {
    return (
      <div className="container mt-5 fade-in">
        <div className="mb-4">
          <h2 className="fw-bold text-dark mb-1">Admin Dashboard</h2>
          <p className="text-muted">Company-wide financial overview.</p>
        </div>

        {/* --- USER LIST SECTION (MOVED TO TOP) --- */}
        <h5 className="fw-bold text-dark mb-3">👥 Employee Management</h5>
        <div className="row g-4 mb-5">
          {users && users.length > 0 ? (
            users.map((user) => (
              <div className="col-md-4" key={user.id}>
                <div
                  className="card border-0 shadow-sm h-100 user-card"
                  style={{ cursor: "pointer", transition: "transform 0.2s" }}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="card-body p-4 d-flex align-items-center">
                    <div
                      className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold me-3"
                      style={{
                        width: "50px",
                        height: "50px",
                        fontSize: "1.2rem",
                      }}
                    >
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h5 className="fw-bold mb-1">{user.name}</h5>
                      <div className="badge bg-light text-secondary border">
                        {user.role === "admin" ? "Administrator" : "Employee"}
                      </div>
                      <div className="text-muted small mt-1">{user.email}</div>
                    </div>
                    <div className="ms-auto text-primary">➔</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center text-muted">
              No users found in database.
            </div>
          )}
        </div>

        {/* --- GLOBAL PROJECT SUMMARY SECTION (MOVED DOWN) --- */}
        <div className="card border-0 shadow-sm mb-5">
          <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold text-primary">
              🏢 Company-Wide Project Overview
            </h5>
            <span className="badge bg-light text-secondary">
              Aggregated Data
            </span>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light text-muted small text-uppercase">
                  <tr>
                    <th className="ps-4 border-0">Project</th>
                    <th className="border-0">Total Income</th>
                    <th className="border-0">Total Expense</th>
                    <th className="border-0">Net Profit/Loss</th>
                  </tr>
                </thead>
                <tbody>
                  {globalProjectSummary.map((p) => (
                    <tr
                      key={p.id}
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/projects/${p.id}`)}
                      title="View Project Details"
                    >
                      <td className="ps-4 fw-bold text-dark">{p.name}</td>
                      <td className="text-success fw-medium">
                        + ₹{p.income.toLocaleString()}
                      </td>
                      <td className="text-danger fw-medium">
                        - ₹{p.expense.toLocaleString()}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            p.income - p.expense >= 0
                              ? "bg-success"
                              : "bg-danger"
                          } bg-opacity-10 ${
                            p.income - p.expense >= 0
                              ? "text-success"
                              : "text-danger"
                          }`}
                        >
                          {p.income - p.expense >= 0 ? "+" : ""} ₹
                          {(p.income - p.expense).toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =================================================================================
  // VIEW 2: INDIVIDUAL USER DASHBOARD (Drill Down)
  // =================================================================================
  return (
    <div className="container mt-5 fade-in">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          {currentUser.role === "admin" && (
            <button
              className="btn btn-link text-decoration-none ps-0 mb-2 text-muted"
              onClick={() => setSelectedUser(null)}
            >
              ← Back to Company Dashboard
            </button>
          )}
          <h2 className="fw-bold text-dark mb-1">
            {currentUser.role === "admin"
              ? `${targetUser.name}'s Overview`
              : `Hello, ${targetUser.name} 👋`}
          </h2>
          <p className="text-muted mb-0">Personal financial summary.</p>
        </div>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div
            className="card border-0 shadow-sm h-100"
            style={{
              background: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
              color: "white",
            }}
          >
            <div className="card-body p-4">
              <p className="mb-1 opacity-75 text-uppercase small fw-bold">
                Balance
              </p>
              <h2 className="display-6 fw-bold mb-0">
                ₹ {balance.toLocaleString()}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="card border-0 shadow-sm h-100 bg-white"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/income")}
            title="View Income Details"
          >
            <div className="card-body p-4">
              <p className="mb-1 text-success text-uppercase small fw-bold">
                Total Income ↗
              </p>
              <h3 className="fw-bold text-dark mb-0">
                ₹ {totalIncome.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="card border-0 shadow-sm h-100 bg-white"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/expenses")}
            title="View Expense Details"
          >
            <div className="card-body p-4">
              <p className="mb-1 text-danger text-uppercase small fw-bold">
                Total Expenses ↗
              </p>
              <h3 className="fw-bold text-dark mb-0">
                ₹ {totalExpense.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Individual Project Summary */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0 fw-bold">User Project Contribution</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light text-muted small text-uppercase">
                    <tr>
                      <th className="ps-4 border-0">Project</th>
                      <th className="border-0">Income</th>
                      <th className="border-0">Expense</th>
                      <th className="border-0">Net</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userProjectSummary.map((p) => (
                      <tr
                        key={p.id}
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/projects/${p.id}`)}
                        title="View Project Ledger"
                      >
                        <td className="ps-4 fw-bold text-dark">{p.name}</td>
                        <td className="text-success">
                          + ₹{p.income.toLocaleString()}
                        </td>
                        <td className="text-danger">
                          - ₹{p.expense.toLocaleString()}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              p.income - p.expense >= 0
                                ? "bg-success"
                                : "bg-danger"
                            } bg-opacity-10 ${
                              p.income - p.expense >= 0
                                ? "text-success"
                                : "text-danger"
                            }`}
                          >
                            {p.income - p.expense >= 0 ? "+" : ""} ₹
                            {(p.income - p.expense).toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0 fw-bold">Top Categories</h5>
            </div>
            <div className="card-body">
              {categoryStats.map((cat, index) => (
                <div key={index} className="mb-4">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="fw-medium text-muted">{cat.name}</span>
                    <span className="fw-bold">
                      ₹ {cat.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="progress" style={{ height: "6px" }}>
                    <div
                      className="progress-bar bg-primary"
                      role="progressbar"
                      style={{ width: `${(cat.total / totalExpense) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              {categoryStats.length === 0 && (
                <p className="text-muted text-center py-4">
                  No data available.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
