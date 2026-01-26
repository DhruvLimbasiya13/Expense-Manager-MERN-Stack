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
    <div className="container mt-5 fade-in">
      <button className="btn btn-link text-decoration-none ps-0 mb-3" onClick={() => navigate("/projects")}>
        ← Back to Projects
      </button>

      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-end mb-4 border-bottom pb-4">
        <div>
          <h1 className="fw-bold mb-1">{project.name}</h1>
          <p className="text-muted mb-0">{project.description}</p>
          <small className="text-muted">
             {project.startDate} to {project.endDate}
          </small>
        </div>
        <div className="text-end">
            <h5 className="text-uppercase text-muted small fw-bold">Net Balance</h5>
            <h2 className={`fw-bold ${netProfit >= 0 ? 'text-success' : 'text-danger'}`}>
                {netProfit >= 0 ? '+' : ''} ₹ {netProfit.toLocaleString()}
            </h2>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
            <div className="p-3 rounded bg-success bg-opacity-10 border border-success border-opacity-10 d-flex justify-content-between align-items-center">
                <span className="text-success fw-bold">Total Income</span>
                <span className="h4 mb-0 text-success fw-bold">₹ {totalInc.toLocaleString()}</span>
            </div>
        </div>
        <div className="col-md-6">
            <div className="p-3 rounded bg-danger bg-opacity-10 border border-danger border-opacity-10 d-flex justify-content-between align-items-center">
                <span className="text-danger fw-bold">Total Expenses</span>
                <span className="h4 mb-0 text-danger fw-bold">₹ {totalExp.toLocaleString()}</span>
            </div>
        </div>
      </div>

      {/* Unified Transaction Table */}
      <div className="card custom-card p-0 shadow-sm border-0">
        <div className="card-header bg-white border-0 py-3">
            <h5 className="mb-0 fw-bold">Transaction Ledger</h5>
        </div>
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="bg-light">
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
                 <tr><td colSpan="5" className="text-center py-5 text-muted">No transactions recorded for this project.</td></tr>
              ) : (
                  transactions.map((t) => (
                    <tr key={`${t.type}-${t.id}`}>
                      <td className="p-3 ps-4 text-muted font-monospace">{t.date}</td>
                      <td className="p-3">
                        {t.type === "income" ? (
                            <span className="badge bg-success bg-opacity-10 text-success">INCOME</span>
                        ) : (
                            <span className="badge bg-danger bg-opacity-10 text-danger">EXPENSE</span>
                        )}
                      </td>
                      <td className="p-3">{getCategoryName(t.categoryId)}</td>
                      <td className="p-3 text-muted small">{t.description}</td>
                      <td className={`p-3 text-end fw-bold pe-4 ${t.type === 'income' ? 'text-success' : 'text-danger'}`}>
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