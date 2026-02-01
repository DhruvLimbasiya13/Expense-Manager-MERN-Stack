import { useNavigate } from "react-router-dom";

function ExpenseList({ expenses, projects, categories, currentUser, users, onDelete }) {
  const navigate = useNavigate();

  const isAdmin = currentUser.role === 'admin';
  
  const filteredExpenses = isAdmin 
    ? expenses 
    : expenses.filter(e => Number(e.userId) === Number(currentUser.id));

  const getProjectName = (id) => projects.find(p => p.id === Number(id))?.name || "Unknown";
  const getCategoryName = (id) => categories.find(c => c.id === Number(id))?.name || "Unknown";
  const getUserName = (uid) => users.find(u => u.id === Number(uid))?.name || "Unknown";

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
                  <tr key={expense.id}>
                    <td className="p-3 ps-4 text-secondary font-monospace small">{expense.date}</td>
                    
                    {isAdmin && (
                      <td className="p-3">
                         <div className="d-flex align-items-center">
                            <div className="text-white rounded-circle d-flex align-items-center justify-content-center me-2 fw-bold" style={{
                              width:"28px", 
                              height:"28px", 
                              fontSize:"0.75rem",
                              background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))'
                            }}>
                                {getUserName(expense.userId).charAt(0)}
                            </div>
                            <span className="fw-medium" style={{ color: 'var(--text-primary)' }}>{getUserName(expense.userId)}</span>
                         </div>
                      </td>
                    )}

                    <td className="p-3 fw-bold" style={{ color: 'var(--text-primary)' }}>{getProjectName(expense.projectId)}</td>
                    <td className="p-3">
                      <span className="badge" style={{
                        background: 'rgba(255, 107, 107, 0.1)',
                        color: 'var(--coral)',
                        border: '1px solid rgba(255, 107, 107, 0.3)'
                      }}>
                          {getCategoryName(expense.categoryId)}
                      </span>
                    </td>
                    <td className="p-3 text-secondary small">{expense.remarks || expense.description || "-"}</td>
                    <td className="p-3">
                      {expense.attachment ? (
                          <span className="badge" style={{
                            background: 'rgba(6, 182, 212, 0.1)',
                            color: 'var(--accent-cyan)',
                            cursor: 'pointer'
                          }} title={expense.attachment}>📎 View</span>
                      ) : (
                          <span className="text-secondary small">-</span>
                      )}
                    </td>
                    <td className="p-3 fw-bold text-coral">
                      ₹ {Number(expense.amount).toLocaleString()}
                    </td>
                    
                    {/* Actions Column */}
                    <td className="p-3 text-end pe-4">
                        <button 
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => navigate(`/expenses/edit/${expense.id}`)}
                            title="Edit"
                        >
                            ✎
                        </button>
                        <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => onDelete(expense.id)}
                            title="Delete"
                        >
                            🗑
                        </button>
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