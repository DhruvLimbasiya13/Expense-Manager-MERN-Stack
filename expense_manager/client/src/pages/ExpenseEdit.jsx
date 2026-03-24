import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { putData } from "../services/api";

function ExpenseEdit({
  expenses,
  setExpenses,
  projects,
  categories,
  subCategories,
}) {
  const navigate = useNavigate();
  const { id } = useParams();

  // Find expense by MongoDB _id (string match)
  const existingExpense = expenses.find((e) => String(e._id) === String(id));

  // Lazy Initialization
  const [formData, setFormData] = useState(() => {
    if (existingExpense) {
      return {
        expenseDate: existingExpense.expenseDate ? new Date(existingExpense.expenseDate).toISOString().split('T')[0] : "",
        amount: existingExpense.amount,
        projectID: existingExpense.projectID?._id || existingExpense.projectID || "",
        categoryID: existingExpense.categoryID?._id || existingExpense.categoryID || "",
        subCategoryID: existingExpense.subCategoryID?._id || existingExpense.subCategoryID || "",
        expenseDetail: existingExpense.expenseDetail || existingExpense.description || "",
      };
    }
    return {
      expenseDate: "",
      amount: "",
      projectID: "",
      categoryID: "",
      subCategoryID: "",
      expenseDetail: "",
    };
  });

  // Redirect if expense not found
  useEffect(() => {
    if (!existingExpense) {
      navigate("/expenses");
    }
  }, [existingExpense, navigate]);

  const expenseCategories = categories.filter((c) => c.isExpense);
  const filteredSubCategories = subCategories.filter(
    (sub) => {
      const subCatId = sub.categoryID?._id || sub.categoryID;
      return String(subCatId) === String(formData.categoryID);
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      expenseDate: formData.expenseDate,
      amount: Number(formData.amount),
      projectID: formData.projectID || null,
      categoryID: formData.categoryID || null,
      subCategoryID: formData.subCategoryID || null,
      expenseDetail: formData.expenseDetail,
    };

    try {
      const updated = await putData(`/expenses/${id}`, payload);
      setExpenses(expenses.map((exp) =>
        String(exp._id) === String(id) ? { ...exp, ...updated } : exp
      ));
      navigate("/expenses");
    } catch (err) {
      alert("Error updating expense: " + err.message);
    }
  };

  if (!existingExpense) return null;

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
                    value={formData.expenseDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expenseDate: e.target.value })
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
                  value={formData.projectID}
                  onChange={(e) =>
                    setFormData({ ...formData, projectID: e.target.value })
                  }
                >
                  <option value="" style={{ color: '#000' }}>Select Project</option>
                  {projects.map((p) => (
                    <option key={p._id} value={p._id} style={{ color: '#000' }}>
                      {p.projectName}
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
                    value={formData.categoryID}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        categoryID: e.target.value,
                        subCategoryID: "",
                      })
                    }
                  >
                    <option value="" style={{ color: '#000' }}>Select Category</option>
                    {expenseCategories.map((c) => (
                      <option key={c._id} value={c._id} style={{ color: '#000' }}>
                        {c.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold" style={{ color: 'var(--text-secondary)' }}>Sub-Category</label>
                  <select
                    className="form-select glass-input"
                    value={formData.subCategoryID}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subCategoryID: e.target.value,
                      })
                    }
                    disabled={!formData.categoryID}
                  >
                    <option value="" style={{ color: '#000' }}>Select Sub-Category</option>
                    {filteredSubCategories.map((sub) => (
                      <option key={sub._id} value={sub._id} style={{ color: '#000' }}>
                        {sub.subCategoryName}
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
                  value={formData.expenseDetail}
                  onChange={(e) =>
                    setFormData({ ...formData, expenseDetail: e.target.value })
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
