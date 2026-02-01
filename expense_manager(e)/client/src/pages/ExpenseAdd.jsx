import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postData } from "../services/api";

function ExpenseAdd({
  expenses,
  setExpenses,
  projects,
  categories,
  subCategories,
  peoples,
  currentUser,
}) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    expenseDate: "",
    amount: "",
    projectID: "",
    categoryID: "",
    subCategoryID: "",
    peopleID: "",
    expenseDetail: "",
  });

  const filteredSubCategories = subCategories.filter(
    (s) => s.categoryID === formData.categoryID,
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      userID: currentUser._id || currentUser.id,
      amount: Number(formData.amount),
      projectID: formData.projectID || null,
      subCategoryID: formData.subCategoryID || null,
    };

    try {
      const saved = await postData("/expenses", payload);
      setExpenses([...expenses, saved]);
      navigate("/expenses");
    } catch (err) {
      alert("Error saving expense: " + err.message);
    }
  };

  return (
    <div className="container mt-5 fade-in-up">
      <div className="card glass-card hover-lift p-4 p-md-5" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h3 className="mb-4 fw-bold" style={{ color: 'var(--text-primary)' }}>Record Expense</h3>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label>Date</label>
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
              <label>Amount</label>
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

          <div className="row">
            <div className="col-md-6 mb-3">
              <label>Employee (People)</label>
              <select
                className="form-select"
                required
                value={formData.peopleID}
                onChange={(e) =>
                  setFormData({ ...formData, peopleID: e.target.value })
                }
              >
                <option value="">Select Person</option>
                {peoples &&
                  peoples.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.peopleName}
                    </option>
                  ))}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label>Project</label>
              <select
                className="form-select"
                value={formData.projectID}
                onChange={(e) =>
                  setFormData({ ...formData, projectID: e.target.value })
                }
              >
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.projectName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label>Category</label>
              <select
                className="form-select"
                required
                value={formData.categoryID}
                onChange={(e) =>
                  setFormData({ ...formData, categoryID: e.target.value })
                }
              >
                <option value="">Select Category</option>
                {categories
                  .filter((c) => c.isExpense)
                  .map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.categoryName}
                    </option>
                  ))}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label>Sub-Category</label>
              <select
                className="form-select"
                value={formData.subCategoryID}
                onChange={(e) =>
                  setFormData({ ...formData, subCategoryID: e.target.value })
                }
              >
                <option value="">Select Sub-Category</option>
                {filteredSubCategories.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.subCategoryName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label>Remarks</label>
            <textarea
              className="form-control"
              value={formData.expenseDetail}
              onChange={(e) =>
                setFormData({ ...formData, expenseDetail: e.target.value })
              }
            ></textarea>
          </div>

          <button type="submit" className="btn btn-coral w-100">
            Save Expense
          </button>
        </form>
      </div>
    </div>
  );
}
export default ExpenseAdd;
