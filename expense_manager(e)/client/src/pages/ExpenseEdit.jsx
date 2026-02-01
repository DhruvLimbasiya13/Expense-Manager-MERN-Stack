import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ExpenseEdit({
  expenses,
  setExpenses,
  projects,
  categories,
  subCategories,
}) {
  const navigate = useNavigate();
  const { id } = useParams();

  // --- FIX: Find expense BEFORE initializing state ---
  const existingExpense = expenses.find((e) => Number(e.id) === Number(id));

  // --- FIX: Lazy Initialization (Sets state immediately, preventing the error) ---
  const [formData, setFormData] = useState(() => {
    if (existingExpense) {
      return {
        date: existingExpense.date,
        amount: existingExpense.amount,
        projectId: existingExpense.projectId,
        categoryId: existingExpense.categoryId,
        subCategoryId: existingExpense.subCategoryId || "",
        remarks: existingExpense.remarks || existingExpense.description || "",
      };
    }
    // Return empty defaults if not found (useEffect will handle redirect)
    return {
      date: "",
      amount: "",
      projectId: "",
      categoryId: "",
      subCategoryId: "",
      remarks: "",
    };
  });

  // Redirect if expense not found (Clean useEffect)
  useEffect(() => {
    if (!existingExpense) {
      navigate("/expenses");
    }
  }, [existingExpense, navigate]);

  const expenseCategories = categories.filter((c) => c.isExpense);
  const filteredSubCategories = subCategories.filter(
    (sub) => Number(sub.categoryId) === Number(formData.categoryId)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedExpenses = expenses.map((exp) =>
      Number(exp.id) === Number(id)
        ? {
            ...exp,
            ...formData,
            amount: Number(formData.amount),
            projectId: Number(formData.projectId),
            categoryId: Number(formData.categoryId),
            subCategoryId: Number(formData.subCategoryId),
          }
        : exp
    );
    setExpenses(updatedExpenses);
    navigate("/expenses");
  };

  if (!existingExpense) return null; // Prevent flicker before redirect

  return (
    <div className="container mt-5 fade-in-up">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card glass-card hover-lift p-4 p-md-5">
            <h3 className="mb-4 fw-bold" style={{ color: 'var(--text-primary)' }}>Edit Expense</h3>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold" style={{ color: 'var(--text-secondary)' }}>Date</label>
                  <input
                    type="date"
                    className="form-control glass-input"
                    required
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold" style={{ color: 'var(--text-secondary)' }}>Amount</label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}>₹</span>
                    <input
                      type="number"
                      className="form-control glass-input"
                      required
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold" style={{ color: 'var(--text-secondary)' }}>Project</label>
                <select
                  className="form-select glass-input"
                  required
                  value={formData.projectId}
                  onChange={(e) =>
                    setFormData({ ...formData, projectId: e.target.value })
                  }
                >
                  <option value="" style={{ color: '#000' }}>Select Project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id} style={{ color: '#000' }}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold" style={{ color: 'var(--text-secondary)' }}>Category</label>
                  <select
                    className="form-select glass-input"
                    required
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        categoryId: e.target.value,
                        subCategoryId: "",
                      })
                    }
                  >
                    <option value="" style={{ color: '#000' }}>Select Category</option>
                    {expenseCategories.map((c) => (
                      <option key={c.id} value={c.id} style={{ color: '#000' }}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold" style={{ color: 'var(--text-secondary)' }}>Sub-Category</label>
                  <select
                    className="form-select glass-input"
                    value={formData.subCategoryId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subCategoryId: e.target.value,
                      })
                    }
                    disabled={!formData.categoryId}
                  >
                    <option value="" style={{ color: '#000' }}>Select Sub-Category</option>
                    {filteredSubCategories.map((sub) => (
                      <option key={sub.id} value={sub.id} style={{ color: '#000' }}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold" style={{ color: 'var(--text-secondary)' }}>Remarks</label>
                <textarea
                  className="form-control glass-input"
                  rows="2"
                  value={formData.remarks}
                  onChange={(e) =>
                    setFormData({ ...formData, remarks: e.target.value })
                  }
                ></textarea>
              </div>

              <div className="d-flex justify-content-end gap-3 mt-4">
                <button
                  type="button"
                  className="btn btn-outline-light border-0"
                  onClick={() => navigate("/expenses")}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-coral shadow-lg px-4">
                  Update Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpenseEdit;
