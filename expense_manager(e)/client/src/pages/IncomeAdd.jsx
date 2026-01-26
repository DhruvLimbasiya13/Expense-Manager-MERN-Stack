import { useState } from "react";
import { useNavigate } from "react-router-dom";

function IncomeAdd({
  incomes,
  setIncomes,
  projects,
  categories,
  subCategories,
  peoples,
  currentUser,
}) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    incomeDate: "",
    amount: "",
    projectID: "",
    categoryID: "",
    subCategoryID: "",
    peopleID: "",
    incomeDetail: "",
    description: "",
    attachmentPath: "",
  });

  const incomeCategories = categories.filter((c) => c.isIncome);
  const filteredSubCategories = subCategories.filter(
    (sub) => String(sub.categoryID) === String(formData.categoryID),
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const newIncome = {
      id: Date.now(),
      userID: currentUser.id,
      ...formData,
      amount: Number(formData.amount),
      projectID: formData.projectID || null,
      subCategoryID: formData.subCategoryID || null,
    };

    setIncomes([...incomes, newIncome]);
    navigate("/income");
  };

  return (
    <div className="container mt-5 fade-in">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card custom-card p-4">
            <h3 className="mb-4">Record Income</h3>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Income Date</label>
                  <input
                    type="date"
                    className="form-control"
                    required
                    value={formData.incomeDate}
                    onChange={(e) =>
                      setFormData({ ...formData, incomeDate: e.target.value })
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

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">
                    Received By (People)
                  </label>
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
                    {incomeCategories.map((c) => (
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

              <div className="mb-4">
                <label className="form-label fw-bold">
                  Income Details / Remarks
                </label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={formData.incomeDetail}
                  onChange={(e) =>
                    setFormData({ ...formData, incomeDetail: e.target.value })
                  }
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary w-100 shadow-sm">
                Save Income
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncomeAdd;
