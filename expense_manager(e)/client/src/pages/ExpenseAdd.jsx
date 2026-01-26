import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ExpenseAdd({
  expenses,
  setExpenses,
  projects,
  categories,
  subCategories,
  peoples, // <--- Make sure to pass 'peoples' from App.jsx
  currentUser,
}) {
  const navigate = useNavigate();

  // Form State matches Backend Schema exactly
  const [formData, setFormData] = useState({
    expenseDate: "",
    amount: "",
    projectID: "",
    categoryID: "",
    subCategoryID: "",
    peopleID: "", // <--- NEW REQUIRED FIELD
    expenseDetail: "", // Previously 'remarks'
    description: "",
    attachmentPath: "",
  });

  // Filter lists based on selection
  const expenseCategories = categories.filter((c) => c.isExpense);
  const filteredSubCategories = subCategories.filter(
    (sub) => String(sub.categoryID) === String(formData.categoryID),
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    // Construct the payload for the API/Backend
    const newExpense = {
      // If you are using API, remove 'id'. If static, keep it.
      id: Date.now(),
      userID: currentUser.id, // Login User
      ...formData,
      amount: Number(formData.amount),
      // Convert empty strings to null for optional fields
      projectID: formData.projectID || null,
      subCategoryID: formData.subCategoryID || null,
    };

    // TODO: Week 8 - Replace this with axios.post('/api/expenses', newExpense)
    setExpenses([...expenses, newExpense]);
    navigate("/expenses");
  };

  return (
    <div className="container mt-5 fade-in">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card custom-card p-4">
            <h3 className="mb-4">Record New Expense</h3>
            <form onSubmit={handleSubmit}>
              {/* Row 1: Date & Amount */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Expense Date</label>
                  <input
                    type="date"
                    className="form-control"
                    required
                    value={formData.expenseDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expenseDate: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Amount</label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="number"
                      className="form-control"
                      required
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: People (Employee) & Project */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">
                    Employee (People)
                  </label>
                  <select
                    className="form-select"
                    required
                    value={formData.peopleID}
                    onChange={(e) =>
                      setFormData({ ...formData, peopleID: e.target.value })
                    }
                  >
                    <option value="">Select Employee</option>
                    {peoples &&
                      peoples.map((p) => (
                        <option key={p.id || p._id} value={p.id || p._id}>
                          {p.peopleName}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Project</label>
                  <select
                    className="form-select"
                    value={formData.projectID}
                    onChange={(e) =>
                      setFormData({ ...formData, projectID: e.target.value })
                    }
                  >
                    <option value="">Select Project (Optional)</option>
                    {projects.map((p) => (
                      <option key={p.id || p._id} value={p.id || p._id}>
                        {p.projectName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Category & Sub-Category */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Category</label>
                  <select
                    className="form-select"
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
                    <option value="">Select Category</option>
                    {expenseCategories.map((c) => (
                      <option key={c.id || c._id} value={c.id || c._id}>
                        {c.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Sub-Category</label>
                  <select
                    className="form-select"
                    value={formData.subCategoryID}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subCategoryID: e.target.value,
                      })
                    }
                    disabled={!formData.categoryID}
                  >
                    <option value="">Select Sub-Category</option>
                    {filteredSubCategories.map((sub) => (
                      <option key={sub.id || sub._id} value={sub.id || sub._id}>
                        {sub.subCategoryName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Remarks / Details */}
              <div className="mb-3">
                <label className="form-label fw-bold">
                  Expense Detail (Remarks)
                </label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={formData.expenseDetail}
                  onChange={(e) =>
                    setFormData({ ...formData, expenseDetail: e.target.value })
                  }
                ></textarea>
              </div>

              {/* Extra Description */}
              <div className="mb-4">
                <label className="form-label fw-bold">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <button type="submit" className="btn btn-primary w-100 shadow-sm">
                Save Expense
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpenseAdd;
