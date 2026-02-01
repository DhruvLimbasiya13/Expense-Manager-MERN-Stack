import { useParams, useNavigate } from "react-router-dom";

function ProjectDetails({ projects, expenses, incomes, categories }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. Find the current Project
  const project = projects.find((p) => p.id === Number(id));

  if (!project) {
    return <div className="container mt-5"><h3>Project not found</h3></div>;
  }

  // 2. Filter and Merge Transactions
  const projectExpenses = expenses
    .filter((e) => Number(e.projectId) === Number(id))
    .map((e) => ({ ...e, type: "expense" }));

  const projectIncomes = incomes
    .filter((i) => Number(i.projectId) === Number(id))
    .map((i) => ({ ...i, type: "income" }));

  // Combine and sort by date (newest first)
  const transactions = [...projectExpenses, ...projectIncomes].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // 3. Calculate Totals
  const totalInc = projectIncomes.reduce((s, i) => s + Number(i.amount), 0);
  const totalExp = projectExpenses.reduce((s, e) => s + Number(e.amount), 0);
  const netProfit = totalInc - totalExp;

  // Helper for Category Name
  const getCategoryName = (catId) => categories.find(c => c.id === Number(catId))?.name || "-";

  return (
    <div className="container mt-5 fade-in-up">
      <button 
        className="btn btn-link text-decoration-none ps-0 mb-4 fw-bold" 
        onClick={() => navigate("/projects")}
        style={{ color: 'var(--accent-cyan)' }}
      >
        ← Back to Projects
      </button>

      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-end mb-5 border-bottom pb-4" style={{ borderColor: 'var(--glass-border)' }}>
        <div>
          <h1 className="fw-bold mb-2" style={{ 
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
          }}>
            {project.name}
          </h1>
          <p className="text-secondary mb-1" style={{ fontSize: '1.1rem' }}>{project.description}</p>
          <small className="text-muted">
             {project.startDate} — {project.endDate}
          </small>
        </div>
        <div className="text-end">
            <h6 className="text-uppercase text-secondary small fw-bold mb-1">Net Balance</h6>
            <h2 className={`fw-bold mb-0 ${netProfit >= 0 ? 'text-gold' : 'text-coral'}`}>
                {netProfit >= 0 ? '+' : ''} ₹ {netProfit.toLocaleString()}
            </h2>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-6">
            <div className="glass-card p-4 d-flex justify-content-between align-items-center hover-lift hover-glow-emerald border-start border-4 border-emerald">
                <div>
                    <span className="text-secondary text-uppercase small fw-bold d-block mb-1">Total Income</span>
                    <span className="h3 mb-0 text-white fw-bold">₹ {totalInc.toLocaleString()}</span>
                </div>
                <div className="text-emerald h1 mb-0">
                    ↗
                </div>
            </div>
        </div>
        <div className="col-md-6">
            <div className="glass-card p-4 d-flex justify-content-between align-items-center hover-lift hover-glow-coral border-start border-4 border-coral">
                <div>
                     <span className="text-secondary text-uppercase small fw-bold d-block mb-1">Total Expenses</span>
                     <span className="h3 mb-0 text-white fw-bold">₹ {totalExp.toLocaleString()}</span>
                </div>
                <div className="text-coral h1 mb-0">
                    ↘
                </div>
            </div>
        </div>
      </div>

      {/* Unified Transaction Table */}
      <div className="glass-card p-0 overflow-hidden">
        <div className="p-4 border-bottom" style={{ borderColor: 'var(--glass-border)' }}>
            <h5 className="mb-0 fw-bold text-white">Transaction Ledger</h5>
        </div>
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead>
              <tr>
                <th className="p-3 border-0 ps-4">Date</th>
                <th className="p-3 border-0">Type</th>
                <th className="p-3 border-0">Category</th>
                <th className="p-3 border-0">Description</th>
                <th className="p-3 border-0 text-end pe-4">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                 <tr><td colSpan="5" className="text-center py-5 text-secondary">No transactions recorded for this project.</td></tr>
              ) : (
                  transactions.map((t) => (
                    <tr key={`${t.type}-${t.id}`}>
                      <td className="p-3 ps-4 text-secondary font-monospace small">{t.date}</td>
                      <td className="p-3">
                        {t.type === "income" ? (
                            <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--emerald)' }}>INCOME</span>
                        ) : (
                            <span className="badge" style={{ background: 'rgba(255, 107, 107, 0.1)', color: 'var(--coral)' }}>EXPENSE</span>
                        )}
                      </td>
                      <td className="p-3 text-white fw-medium">{getCategoryName(t.categoryId)}</td>
                      <td className="p-3 text-secondary small">{t.description}</td>
                      <td className={`p-3 text-end fw-bold pe-4 ${t.type === 'income' ? 'text-emerald' : 'text-coral'}`}>
                        {t.type === 'income' ? '+' : '-'} ₹ {Number(t.amount).toLocaleString()}
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

export default ProjectDetails;