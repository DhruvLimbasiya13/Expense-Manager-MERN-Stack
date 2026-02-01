import { useNavigate } from "react-router-dom";

function IncomeList({ incomes, projects, categories, currentUser, users, onDelete }) {
  const navigate = useNavigate();
  const isAdmin = currentUser.role === 'admin';

  const filteredIncomes = isAdmin 
    ? incomes 
    : incomes.filter(i => Number(i.userId) === Number(currentUser.id));

  const getProjectName = (id) => projects.find(p => p.id === Number(id))?.name || "Unknown";
  const getCategoryName = (id) => categories.find(c => c.id === Number(id))?.name || "Unknown";
  const getUserName = (uid) => users.find(u => u.id === Number(uid))?.name || "Unknown";

  return (
    <div className="container mt-5 fade-in-up">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 style={{ color: 'var(--text-primary)' }}>{isAdmin ? "All Income Records" : "My Income"}</h2>
          <p className="text-secondary">
             {isAdmin ? "View revenue streams across all users." : "Track your earnings and salary."}
          </p>
        </div>
        <button className="btn btn-emerald shadow-sm" onClick={() => navigate("/income/add")}>
          + Record Income
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
                <th className="p-3 border-0">Proof</th>
                <th className="p-3 border-0">Amount</th>
                <th className="p-3 border-0 text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncomes.length === 0 ? (
                <tr><td colSpan={isAdmin ? 8 : 7} className="text-center p-5 text-secondary">No income records found.</td></tr>
              ) : (
                filteredIncomes.map((income) => (
                  <tr key={income.id}>
                    <td className="p-3 ps-4 text-secondary font-monospace small">{income.date}</td>
                    {isAdmin && (
                      <td className="p-3">
                         <div className="d-flex align-items-center">
                            <div className="text-white rounded-circle d-flex align-items-center justify-content-center me-2 fw-bold" style={{
                              width:"28px", 
                              height:"28px", 
                              fontSize:"0.75rem",
                              background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))'
                            }}>
                                {getUserName(income.userId).charAt(0)}
                            </div>
                            <span className="fw-medium" style={{ color: 'var(--text-primary)' }}>{getUserName(income.userId)}</span>
                         </div>
                      </td>
                    )}
                    <td className="p-3 fw-bold" style={{ color: 'var(--text-primary)' }}>{getProjectName(income.projectId)}</td>
                    <td className="p-3">
                      <span className="badge" style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: 'var(--emerald)',
                        border: '1px solid rgba(16, 185, 129, 0.3)'
                      }}>
                          {getCategoryName(income.categoryId)}
                      </span>
                    </td>
                    <td className="p-3 text-secondary small">{income.remarks || income.description || income.source}</td>
                    <td className="p-3">
                      {income.attachment ? (
                          <span className="badge" style={{
                            background: 'rgba(6, 182, 212, 0.1)',
                            color: 'var(--accent-cyan)'
                          }} title={income.attachment}>📎 View</span>
                      ) : (
                          <span className="text-secondary small">-</span>
                      )}
                    </td>
                    <td className="p-3 fw-bold text-emerald">
                      + ₹ {Number(income.amount).toLocaleString()}
                    </td>
                    
                    {/* Actions Column */}
                    <td className="p-3 text-end pe-4">
                        <button 
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => navigate(`/income/edit/${income.id}`)}
                        >
                            ✎
                        </button>
                        <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => onDelete(income.id)}
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

export default IncomeList;