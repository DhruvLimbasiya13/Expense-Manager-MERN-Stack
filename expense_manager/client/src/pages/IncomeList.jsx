import { useNavigate } from "react-router-dom";
import { deleteData } from "../services/api";

function IncomeList({ incomes, setIncomes, projects, categories, peoples, currentUser, users }) {
  const navigate = useNavigate();
  const isAdmin = currentUser?.role === 'admin' || currentUser?.userType === 'admin';

  // Employee filtering: Employee _id → matches peopleID; Admin _id → matches userID
  const filteredIncomes = isAdmin
    ? incomes
    : incomes.filter(i => {
      const incPeopleId = i.peopleID?._id || i.peopleID;
      const incUserId = i.userID?._id || i.userID;
      return String(incPeopleId) === String(currentUser._id) || String(incUserId) === String(currentUser._id);
    });

  // Populated field lookups
  const getProjectName = (income) => {
    const populatedProjectName = income.projectID?.projectName;
    if (populatedProjectName) return populatedProjectName;

    const projectId = income.projectID?._id || income.projectID;
    const matchedProject = projects?.find(
      (p) => String(p._id || p.id) === String(projectId),
    );
    return matchedProject?.projectName || "-";
  };
  const getCategoryName = (income) => {
    const populatedCategoryName = income.categoryID?.categoryName;
    if (populatedCategoryName) return populatedCategoryName;

    const categoryId = income.categoryID?._id || income.categoryID;
    const matchedCategory = categories?.find(
      (c) => String(c._id || c.id) === String(categoryId),
    );
    return matchedCategory?.categoryName || "-";
  };
  const getUserName = (income) => {
    const peopleId = income.peopleID?._id || income.peopleID;
    const userId = income.userID?._id || income.userID;

    const peopleName =
      income.peopleID?.peopleName ||
      peoples?.find((p) => String(p._id || p.id) === String(peopleId))?.peopleName;

    const userName =
      income.userID?.userName ||
      users?.find((u) => String(u._id || u.id) === String(userId))?.userName ||
      users?.find((u) => String(u._id || u.id) === String(userId))?.name;

    return peopleName || userName || "-";
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this income record?")) {
      try {
        await deleteData(`/incomes/${id}`);
        if (setIncomes) {
          setIncomes(incomes.filter(i => i._id !== id));
        }
      } catch (err) {
        console.error("Failed to delete income", err);
        alert("Failed to delete income");
      }
    }
  };

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
                  <tr key={income._id}>
                    <td className="p-3 ps-4 text-secondary font-monospace small">
                      {income.incomeDate ? new Date(income.incomeDate).toLocaleDateString() : "-"}
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
                            {getUserName(income).charAt(0)}
                          </div>
                          <span className="fw-medium" style={{ color: 'var(--text-primary)' }}>{getUserName(income)}</span>
                        </div>
                      </td>
                    )}
                    <td className="p-3 fw-bold" style={{ color: 'var(--text-primary)' }}>{getProjectName(income)}</td>
                    <td className="p-3">
                      <span className="badge" style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: 'var(--emerald)',
                        border: '1px solid rgba(16, 185, 129, 0.3)'
                      }}>
                        {getCategoryName(income)}
                      </span>
                    </td>
                    <td className="p-3 text-secondary small">{income.incomeDetail || income.description || "-"}</td>
                    <td className="p-3">
                      {income.attachmentPath ? (
                        <span className="badge" style={{
                          background: 'rgba(6, 182, 212, 0.1)',
                          color: 'var(--accent-cyan)'
                        }} title={income.attachmentPath}>📎 View</span>
                      ) : (
                        <span className="text-secondary small">-</span>
                      )}
                    </td>
                    <td className="p-3 fw-bold text-emerald">
                      + ₹ {Number(income.amount).toLocaleString()}
                    </td>

                    {/* Actions Column */}
                    <td className="p-3 text-end pe-4">
                      <div className="d-flex justify-content-end align-items-center gap-2" style={{ whiteSpace: 'nowrap' }}>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => navigate(`/income/edit/${income._id}`)}
                          title="Edit"
                          style={{ padding: '4px 8px', lineHeight: 1 }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(income._id)}
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

export default IncomeList;