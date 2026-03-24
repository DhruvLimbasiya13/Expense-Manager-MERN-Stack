import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Dashboard({
  expenses = [],
  incomes = [],
  projects = [],
  users = [],
  currentUser,
}) {
  // SAFE CHECK: Access role safely — login returns userType for admin, role for employee
  const isAdmin = currentUser?.role === "admin" || currentUser?.userType === "admin";
  const navigate = useNavigate();

  // --- Filter data by role: employees see only their own data ---
  // Employee _id comes from People collection → matches peopleID in expenses/incomes
  // Admin _id comes from User collection → matches userID in expenses/incomes
  const myExpenses = isAdmin
    ? expenses
    : expenses.filter(e => {
      const expPeopleId = e.peopleID?._id || e.peopleID;
      const expUserId = e.userID?._id || e.userID;
      return String(expPeopleId) === String(currentUser._id) || String(expUserId) === String(currentUser._id);
    });

  const myIncomes = isAdmin
    ? incomes
    : incomes.filter(i => {
      const incPeopleId = i.peopleID?._id || i.peopleID;
      const incUserId = i.userID?._id || i.userID;
      return String(incPeopleId) === String(currentUser._id) || String(incUserId) === String(currentUser._id);
    });

  // --- Calculations (using filtered data) ---
  const totalExpense = myExpenses.reduce(
    (acc, curr) => acc + Number(curr.amount || 0),
    0,
  );
  const totalIncome = myIncomes.reduce(
    (acc, curr) => acc + Number(curr.amount || 0),
    0,
  );
  const balance = totalIncome - totalExpense;

  // --- Project Summary Data (project-wise total income & expense) ---
  // Only show projects the user is involved in (has at least one transaction)
  const projectSummaries = projects.map(project => {
    const projectId = project._id;
    const projectName = project.projectName || "Unknown Project";

    const projExpenses = myExpenses
      .filter(e => {
        const eProjId = e.projectID?._id || e.projectID;
        return String(eProjId) === String(projectId);
      })
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);

    const projIncomes = myIncomes
      .filter(i => {
        const iProjId = i.projectID?._id || i.projectID;
        return String(iProjId) === String(projectId);
      })
      .reduce((sum, i) => sum + Number(i.amount || 0), 0);

    const projBalance = projIncomes - projExpenses;

    return {
      id: projectId,
      name: projectName,
      totalIncome: projIncomes,
      totalExpense: projExpenses,
      balance: projBalance
    };
  }).filter(p => p.totalIncome > 0 || p.totalExpense > 0);

  return (
    <div className="container mt-4 fade-in-up">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold" style={{ color: 'var(--text-primary)' }}>Dashboard</h2>
          <p className="text-secondary">
            Welcome back, {currentUser?.userName || currentUser?.peopleName || currentUser?.name || "User"}
            ! {!isAdmin && <span className="badge bg-secondary ms-2">Employee</span>}
          </p>
        </div>
        <div>
          {isAdmin && (
            <button
              className="btn btn-premium btn-sm shadow-sm"
              onClick={() => navigate("/users")}
            >
              Manage Users
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards — Employee sees their own totals, Admin sees company-wide */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card glass-card hover-lift stagger-item p-4 border-start border-4 border-emerald hover-glow-emerald">
            <h6 className="text-secondary text-uppercase small fw-bold mb-3">
              {isAdmin ? "Total Income (All)" : "My Total Income"}
            </h6>
            <h3 className="text-emerald fw-bold mb-0">
              ₹{totalIncome.toLocaleString()}
            </h3>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card glass-card hover-lift stagger-item p-4 border-start border-4 border-coral hover-glow-coral">
            <h6 className="text-secondary text-uppercase small fw-bold mb-3">
              {isAdmin ? "Total Expenses (All)" : "My Total Expenses"}
            </h6>
            <h3 className="text-coral fw-bold mb-0">
              ₹{totalExpense.toLocaleString()}
            </h3>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div
            className={`card glass-card hover-lift stagger-item p-4 border-start border-4 ${balance >= 0 ? "border-gold hover-glow-gold" : "border-warning"}`}
          >
            <h6 className="text-secondary text-uppercase small fw-bold mb-3">
              Net Balance
            </h6>
            <h3
              className={
                balance >= 0 ? "text-gold fw-bold mb-0" : "text-warning fw-bold mb-0"
              }
            >
              ₹{balance.toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      {/* Project Summary Section — shows project-wise total income & expense */}
      <div className="card glass-card hover-lift p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>
            {isAdmin ? "Project-wise Summary" : "My Project Summary"}
          </h5>
          <Link
            to="/projects"
            className="btn btn-link text-decoration-none small"
            style={{ color: 'var(--accent-cyan)' }}
          >
            View All
          </Link>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th className="border-0">Project</th>
                <th className="border-0">Total Income</th>
                <th className="border-0">Total Expense</th>
                <th className="border-0">Balance</th>
                <th className="border-0 text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {projectSummaries.length > 0 ? (
                projectSummaries.slice(0, 5).map((summary, index) => (
                  <tr key={summary.id || index}>
                    <td className="fw-bold" style={{ color: 'var(--text-primary)' }}>
                      {summary.name}
                    </td>
                    <td className="text-emerald fw-medium">
                      ₹{summary.totalIncome.toLocaleString()}
                    </td>
                    <td className="text-coral fw-medium">
                      ₹{summary.totalExpense.toLocaleString()}
                    </td>
                    <td className={`fw-bold ${summary.balance >= 0 ? "text-gold" : "text-warning"}`}>
                      ₹{summary.balance.toLocaleString()}
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-premium"
                        onClick={() => navigate(`/projects/${summary.id}`)}
                      >
                        View More
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-3 text-secondary">
                    {isAdmin ? "No projects found" : "No projects with your transactions"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADMIN SECTION: Project-Related Users */}
      {isAdmin && (
        <div className="card glass-card hover-lift p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>Project Users</h5>
            <Link
              to="/users"
              className="btn btn-link text-decoration-none small"
              style={{ color: 'var(--accent-cyan)' }}
            >
              View All
            </Link>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th className="border-0">User</th>
                  <th className="border-0">Role</th>
                  <th className="border-0">Email</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  // Collect unique user IDs from transactions (expenses + incomes)
                  const activeUserIds = new Set();
                  myExpenses.forEach(e => {
                    const uid = e.userID?._id || e.userID;
                    if (uid) activeUserIds.add(String(uid));
                    const pid = e.peopleID?._id || e.peopleID;
                    if (pid) activeUserIds.add(String(pid));
                  });
                  myIncomes.forEach(i => {
                    const uid = i.userID?._id || i.userID;
                    if (uid) activeUserIds.add(String(uid));
                    const pid = i.peopleID?._id || i.peopleID;
                    if (pid) activeUserIds.add(String(pid));
                  });

                  // Filter users list to only those involved
                  const projectUsers = users.filter(u => activeUserIds.has(String(u._id)));

                  return projectUsers.length > 0 ? (
                    projectUsers.slice(0, 5).map((user, index) => {
                      const displayName = user?.userName || user?.name || "Unknown";
                      return (
                        <tr key={user._id || index}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div
                                className="text-white rounded-circle d-flex align-items-center justify-content-center me-3 fw-bold"
                                style={{
                                  width: "35px",
                                  height: "35px",
                                  fontSize: "14px",
                                  background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))'
                                }}
                              >
                                {displayName.charAt(0).toUpperCase()}
                              </div>
                              <span className="fw-bold" style={{ color: 'var(--text-primary)' }}>
                                {displayName}
                              </span>
                            </div>
                          </td>
                          <td>
                            <span
                              className={`badge ${user.role === "admin" ? "bg-gold" : "bg-secondary"} rounded-pill px-3`}
                              style={user.role === "admin" ? { color: '#000' } : {}}
                            >
                              {user.role || "admin"}
                            </span>
                          </td>
                          <td className="text-secondary small">
                            {user.emailAddress || user.email}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-3 text-secondary">
                        No project users found
                      </td>
                    </tr>
                  );
                })()}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
