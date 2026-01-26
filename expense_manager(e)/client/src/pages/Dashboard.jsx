import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
);

function Dashboard({
  expenses = [],
  incomes = [],
  projects = [],
  users = [],
  currentUser,
}) {
  // 1. SAFE CHECK: Access role safely
  const isAdmin = currentUser?.role === "admin";

  // --- Calculations ---
  // Using || 0 ensures we don't add "undefined" to numbers
  const totalExpense = expenses.reduce(
    (acc, curr) => acc + Number(curr.amount || 0),
    0,
  );
  const totalIncome = incomes.reduce(
    (acc, curr) => acc + Number(curr.amount || 0),
    0,
  );
  const balance = totalIncome - totalExpense;

  // --- Chart Data Preparation ---
  const pieData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [totalIncome, totalExpense],
        backgroundColor: ["#198754", "#dc3545"], // Green, Red
        hoverBackgroundColor: ["#157347", "#bb2d3b"],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    // Fallback to "Project" if name is missing
    labels: projects
      .map((p) => p.projectName || p.name || "Project")
      .slice(0, 5),
    datasets: [
      {
        label: "Project Budgets (Estimated)",
        // FIX: Removed Math.random(). Used index (i) for stable dummy data.
        data: projects.slice(0, 5).map((_, i) => (i + 1) * 15000),
        backgroundColor: "#0d6efd",
      },
    ],
  };

  return (
    <div className="container mt-4 fade-in">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark">Dashboard</h2>
          {/* SAFE NAME CHECK: Prevents crash if user name is missing */}
          <p className="text-muted">
            Welcome back, {currentUser?.userName || currentUser?.name || "User"}
            !
          </p>
        </div>
        <div>
          {isAdmin && (
            <button className="btn btn-dark btn-sm shadow-sm">
              Manage Users
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm p-3 border-start border-5 border-success">
            <h6 className="text-muted text-uppercase small fw-bold">
              Total Income
            </h6>
            <h3 className="text-success fw-bold">
              ₹{totalIncome.toLocaleString()}
            </h3>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm p-3 border-start border-5 border-danger">
            <h6 className="text-muted text-uppercase small fw-bold">
              Total Expenses
            </h6>
            <h3 className="text-danger fw-bold">
              ₹{totalExpense.toLocaleString()}
            </h3>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div
            className={`card border-0 shadow-sm p-3 border-start border-5 ${balance >= 0 ? "border-primary" : "border-warning"}`}
          >
            <h6 className="text-muted text-uppercase small fw-bold">
              Net Balance
            </h6>
            <h3
              className={
                balance >= 0 ? "text-primary fw-bold" : "text-warning fw-bold"
              }
            >
              ₹{balance.toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="card border-0 shadow-sm p-4 h-100">
            <h5 className="fw-bold mb-4">Overview</h5>
            <div
              className="d-flex justify-content-center"
              style={{ maxHeight: "300px" }}
            >
              {/* Show message if no data */}
              {totalIncome === 0 && totalExpense === 0 ? (
                <p className="text-muted my-auto">No data to display chart</p>
              ) : (
                <Pie data={pieData} />
              )}
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="card border-0 shadow-sm p-4 h-100">
            <h5 className="fw-bold mb-4">Active Projects</h5>
            {projects.length === 0 ? (
              <p className="text-muted">No active projects found.</p>
            ) : (
              <Bar
                data={barData}
                options={{ responsive: true, maintainAspectRatio: false }}
                height={250}
              />
            )}
          </div>
        </div>
      </div>

      {/* ADMIN SECTION: User List */}
      {isAdmin && (
        <div className="card border-0 shadow-sm p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">System Users</h5>
            <Link
              to="/users"
              className="btn btn-link text-decoration-none small"
            >
              View All
            </Link>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="border-0">User</th>
                  <th className="border-0">Role</th>
                  <th className="border-0">Email</th>
                </tr>
              </thead>
              <tbody>
                {/* SAFE MAP: Check if users array exists */}
                {users && users.length > 0 ? (
                  users.slice(0, 5).map((user, index) => {
                    // SAFE NAME LOGIC: Handle missing names safely
                    // Checks 'userName', then 'name', then defaults to "Unknown"
                    const displayName =
                      user?.userName || user?.name || "Unknown";

                    return (
                      <tr key={user._id || index}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div
                              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3 fw-bold"
                              style={{
                                width: "35px",
                                height: "35px",
                                fontSize: "14px",
                              }}
                            >
                              {/* SAFE CHARAT: Ensure string exists before charAt */}
                              {displayName.charAt(0).toUpperCase()}
                            </div>
                            <span className="fw-bold text-dark">
                              {displayName}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge ${user.role === "admin" ? "bg-dark" : "bg-secondary"} rounded-pill px-3`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="text-muted small">
                          {user.emailAddress || user.email}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-3 text-muted">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
