import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postData } from "../services/api";

function ExpenseAdd({
  expenses,
  setExpenses,
  projects,
  categories,
  setCategories,
  subCategories,
  setSubCategories,
  peoples,
  currentUser,
}) {
  const navigate = useNavigate();
  const isEmployeeLogin = currentUser?.userType === "employee";
  const currentPeopleId = currentUser?._id || "";
  const currentPeopleName =
    currentUser?.peopleName || currentUser?.userName || currentUser?.name || "";

  const [formData, setFormData] = useState({
    expenseDate: "",
    amount: "",
    projectID: "",
    categoryID: "",
    subCategoryID: "",
    peopleID: isEmployeeLogin ? currentPeopleId : "",
    expenseDetail: "",
  });

  // Modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubCategoryModal, setShowSubCategoryModal] = useState(false);

  // New category/subcategory form data
  const [newCategory, setNewCategory] = useState({
    categoryName: "",
    isExpense: true,
    isIncome: false,
    description: "",
  });

  const [newSubCategory, setNewSubCategory] = useState({
    subCategoryName: "",
    categoryID: "",
    description: "",
  });

  const resolveCategoryId = (categoryRef) =>
    String(categoryRef?._id || categoryRef || "");

  const filteredSubCategories = subCategories.filter(
    (s) => resolveCategoryId(s.categoryID) === String(formData.categoryID),
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resolvedUserId =
      currentUser?.userID?._id || currentUser?.userID || currentUser?._id || currentUser?.id;

    const payload = {
      ...formData,
      userID: resolvedUserId,
      peopleID: formData.peopleID || (isEmployeeLogin ? currentPeopleId : ""),
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

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const payload = {
      ...newCategory,
      userID: currentUser._id || currentUser.id,
      isActive: true,
      sequence: categories.length + 1,
    };

    try {
      const saved = await postData("/categories", payload);
      setCategories([...categories, saved]);
      setFormData({ ...formData, categoryID: saved._id });
      setShowCategoryModal(false);
      setNewCategory({ categoryName: "", isExpense: true, isIncome: false, description: "" });
    } catch (err) {
      alert("Error saving category: " + err.message);
    }
  };

  const handleAddSubCategory = async (e) => {
    e.preventDefault();
    const payload = {
      ...newSubCategory,
      userID: currentUser._id || currentUser.id,
      isActive: true,
      isExpense: true,
      isIncome: false,
      sequence: subCategories.length + 1,
    };

    try {
      const saved = await postData("/subcategories", payload);
      setSubCategories([...subCategories, saved]);
      setFormData({ ...formData, subCategoryID: saved._id });
      setShowSubCategoryModal(false);
      setNewSubCategory({ subCategoryName: "", categoryID: "", description: "" });
    } catch (err) {
      alert("Error saving sub-category: " + err.message);
    }
  };

  return (
    <div className="container mt-5 fade-in-up">
      <div className="card glass-card hover-lift p-4 p-md-5" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h3 className="mb-4 fw-bold" style={{ color: 'var(--text-primary)' }}>Record Expense</h3>
        <form onSubmit={handleSubmit} className="expense-add-form">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label small fw-bold" style={{ color: 'var(--text-secondary)' }}>Date</label>
              <input
                type="date"
                className="form-control"
                required
                value={formData.expenseDate}
                onChange={(e) =>
                  setFormData({ ...formData, expenseDate: e.target.value })
                }
                style={{ color: formData.expenseDate ? 'var(--text-primary)' : 'var(--text-muted)' }}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label small fw-bold" style={{ color: 'var(--text-secondary)' }}>Amount</label>
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
              <label className="form-label small fw-bold" style={{ color: 'var(--text-secondary)' }}>Employee (People)</label>
              {isEmployeeLogin ? (
                <input
                  type="text"
                  className="form-control"
                  value={currentPeopleName}
                  readOnly
                  style={{ color: 'var(--text-primary)' }}
                />
              ) : (
                <select
                  className="form-select"
                  required
                  value={formData.peopleID}
                  onChange={(e) =>
                    setFormData({ ...formData, peopleID: e.target.value })
                  }
                  style={{ color: formData.peopleID ? 'var(--text-primary)' : 'var(--text-muted)' }}
                >
                  <option value="">Select Person</option>
                  {peoples &&
                    peoples.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.peopleName}
                      </option>
                    ))}
                </select>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label small fw-bold" style={{ color: 'var(--text-secondary)' }}>Project</label>
              <select
                className="form-select"
                value={formData.projectID}
                onChange={(e) =>
                  setFormData({ ...formData, projectID: e.target.value })
                }
                style={{ color: formData.projectID ? 'var(--text-primary)' : 'var(--text-muted)' }}
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
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label small fw-bold mb-0" style={{ color: 'var(--text-secondary)' }}>Category</label>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-emerald"
                  onClick={() => setShowCategoryModal(true)}
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  + Add New
                </button>
              </div>
              <select
                className="form-select"
                required
                value={formData.categoryID}
                onChange={(e) =>
                  setFormData({ ...formData, categoryID: e.target.value, subCategoryID: "" })
                }
                style={{ color: formData.categoryID ? 'var(--text-primary)' : 'var(--text-muted)' }}
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
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label small fw-bold mb-0" style={{ color: 'var(--text-secondary)' }}>Sub-Category</label>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-emerald"
                  onClick={() => {
                    setNewSubCategory({ ...newSubCategory, categoryID: formData.categoryID });
                    setShowSubCategoryModal(true);
                  }}
                  disabled={!formData.categoryID}
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.5rem',
                    opacity: !formData.categoryID ? 0.5 : 1,
                    cursor: !formData.categoryID ? 'not-allowed' : 'pointer'
                  }}
                >
                  + Add New
                </button>
              </div>
              <select
                className="form-select"
                value={formData.subCategoryID}
                onChange={(e) =>
                  setFormData({ ...formData, subCategoryID: e.target.value })
                }
                style={{ color: formData.subCategoryID ? 'var(--text-primary)' : 'var(--text-muted)' }}
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
            <label className="form-label small fw-bold" style={{ color: 'var(--text-secondary)' }}>Remarks</label>
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

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content glass-card" style={{ border: '1px solid var(--glass-border)' }}>
              <div className="modal-header" style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <h5 className="modal-title fw-bold" style={{ color: 'var(--text-primary)' }}>Add New Category</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCategoryModal(false)}
                  style={{ filter: 'invert(1)' }}
                ></button>
              </div>
              <form onSubmit={handleAddCategory}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-bold" style={{ color: 'var(--text-secondary)' }}>Category Name</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={newCategory.categoryName}
                      onChange={(e) => setNewCategory({ ...newCategory, categoryName: e.target.value })}
                      placeholder="Enter category name"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold" style={{ color: 'var(--text-secondary)' }}>Description (Optional)</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      placeholder="Enter description"
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer" style={{ borderTop: '1px solid var(--glass-border)' }}>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowCategoryModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-emerald">
                    Save Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Category Modal */}
      {showSubCategoryModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content glass-card" style={{ border: '1px solid var(--glass-border)' }}>
              <div className="modal-header" style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <h5 className="modal-title fw-bold" style={{ color: 'var(--text-primary)' }}>Add New Sub-Category</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowSubCategoryModal(false)}
                  style={{ filter: 'invert(1)' }}
                ></button>
              </div>
              <form onSubmit={handleAddSubCategory}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-bold" style={{ color: 'var(--text-secondary)' }}>Parent Category</label>
                    <input
                      type="text"
                      className="form-control"
                      value={categories.find(c => c._id === formData.categoryID)?.categoryName || ''}
                      disabled
                      style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold" style={{ color: 'var(--text-secondary)' }}>Sub-Category Name</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={newSubCategory.subCategoryName}
                      onChange={(e) => setNewSubCategory({ ...newSubCategory, subCategoryName: e.target.value, categoryID: formData.categoryID })}
                      placeholder="Enter sub-category name"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold" style={{ color: 'var(--text-secondary)' }}>Description (Optional)</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={newSubCategory.description}
                      onChange={(e) => setNewSubCategory({ ...newSubCategory, description: e.target.value })}
                      placeholder="Enter description"
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer" style={{ borderTop: '1px solid var(--glass-border)' }}>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowSubCategoryModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-emerald">
                    Save Sub-Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default ExpenseAdd;
