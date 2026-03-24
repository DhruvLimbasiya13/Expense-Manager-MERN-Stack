import { useNavigate } from "react-router-dom";
import { deleteData } from "../services/api";

function ExpenseList({ expenses, setExpenses, projects, categories, peoples, currentUser, users }) {
  const navigate = useNavigate();

  const isAdmin = currentUser?.role === 'admin' || currentUser?.userType === 'admin';

  // Employee filtering: Employee _id → matches peopleID; Admin _id → matches userID
  const filteredExpenses = isAdmin
    ? expenses
    : expenses.filter(e => {
      const expPeopleId = e.peopleID?._id || e.peopleID;
      const expUserId = e.userID?._id || e.userID;
      return String(expPeopleId) === String(currentUser._id) || String(expUserId) === String(currentUser._id);
    });

  // Populated field lookups — the server populates these refs
  const getProjectName = (expense) => expense.projectID?.projectName || "-";
  const getCategoryName = (expense) => expense.categoryID?.categoryName || "-";
  const getUserName = (expense) => {
    const peopleId = expense.peopleID?._id || expense.peopleID;
    const userId = expense.userID?._id || expense.userID;

    const peopleName =
      expense.peopleID?.peopleName ||
      peoples?.find((p) => String(p._id || p.id) === String(peopleId))?.peopleName;

    const userName =
      expense.userID?.userName ||
      users?.find((u) => String(u._id || u.id) === String(userId))?.userName ||
      users?.find((u) => String(u._id || u.id) === String(userId))?.name;

    return peopleName || userName || "-";
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await deleteData(`/expenses/${id}`);
        if (setExpenses) {
          setExpenses(expenses.filter(e => e._id !== id));
        }
      } catch (err) {
        console.error("Failed to delete expense", err);
        alert("Failed to delete expense");
      }
    }
  };

  return (
    <div className="container mt-5 fade-in-up">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 style={{ color: 'var(--text-primary)' }}>{isAdmin ? "All User Expenses" : "My Expenses"}</h2>
          <p className="text-secondary">
            {isAdmin ? "Manage and review expenses from all employees." : "Track your personal spending history."}
          </p>
        </div>
        <button className="btn btn-coral shadow-sm" onClick={() => navigate("/expenses/add")}>
          + Record Expense
        </button>
      </div>

      <div className="card glass-card hover-lift p-0 border-0 overflow-hidden">
        <div className="table-responsive no-scrollbar">
          <table className="table table-hover mb-0 align-middle">
            <thead>
              <tr>
                <th className="p-3 border-0 ps-4">Date</th>
                {isAdmin && <th className="p-3 border-0">User</th>}
                <th className="p-3 border-0">Project</th>
                <th className="p-3 border-0">Category</th>
                <th className="p-3 border-0">Remarks</th>
                <th className="p-3 border-0">Bill</th>
                <th className="p-3 border-0">Amount</th>
                <th className="p-3 border-0 text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length === 0 ? (
                <tr><td colSpan={isAdmin ? 8 : 7} className="text-center p-5 text-secondary">No expenses found.</td></tr>
              ) : (
                filteredExpenses.map((expense) => (
                  <tr key={expense._id}>
                    <td className="p-3 ps-4 text-secondary font-monospace small">
                      {expense.expenseDate ? new Date(expense.expenseDate).toLocaleDateString() : "-"}
                    </td>

                    {isAdmin && (
                      <td className="p-3">
                        <div className="d-flex align-items-center">
                          <div className="text-white rounded-circle d-flex align-items-center justify-content-center me-2 fw-bold" style={{
                            width: "28px",
                            height: "28px",
                            fontSize: "0.75rem",
                            background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))'
                          }}>
                            {getUserName(expense).charAt(0)}
                          </div>
                          <span className="fw-medium" style={{ color: 'var(--text-primary)' }}>{getUserName(expense)}</span>
                        </div>
                      </td>
                    )}

                    <td className="p-3 fw-bold" style={{ color: 'var(--text-primary)' }}>{getProjectName(expense)}</td>
                    <td className="p-3">
                      <span className="badge" style={{
                        background: 'rgba(255, 107, 107, 0.1)',
                        color: 'var(--coral)',
                        border: '1px solid rgba(255, 107, 107, 0.3)'
                      }}>
                        {getCategoryName(expense)}
                      </span>
                    </td>
                    <td className="p-3 text-secondary small">{expense.expenseDetail || expense.description || "-"}</td>
                    <td className="p-3">
                      {expense.attachmentPath ? (
                        <span className="badge" style={{
                          background: 'rgba(6, 182, 212, 0.1)',
                          color: 'var(--accent-cyan)',
                          cursor: 'pointer'
                        }} title={expense.attachmentPath}>📎 View</span>
                      ) : (
                        <span className="text-secondary small">-</span>
                      )}
                    </td>
                    <td className="p-3 fw-bold text-coral">
                      ₹ {Number(expense.amount).toLocaleString()}
                    </td>

                    {/* Actions Column */}
                    <td className="p-3 text-end pe-4">
                      <div className="d-flex justify-content-end align-items-center gap-2" style={{ whiteSpace: 'nowrap' }}>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => navigate(`/expenses/edit/${expense._id}`)}
                          title="Edit"
                          style={{ padding: '4px 8px', lineHeight: 1 }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(expense._id)}
                          title="Delete"
                          style={{ padding: '4px 8px', lineHeight: 1 }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ExpenseList;