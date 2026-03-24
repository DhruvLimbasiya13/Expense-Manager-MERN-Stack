import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postData } from "../services/api";

function IncomeAdd({
  incomes,
  setIncomes,
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
    incomeDate: "",
    amount: "",
    projectID: "",
    categoryID: "",
    subCategoryID: "",
    peopleID: isEmployeeLogin ? currentPeopleId : "",
    incomeDetail: "",
    description: "",
    attachmentPath: "",
  });

  // Modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubCategoryModal, setShowSubCategoryModal] = useState(false);

  // New category/subcategory form data
  const [newCategory, setNewCategory] = useState({
    categoryName: "",
    isExpense: false,
    isIncome: true,
    description: "",
  });

  const [newSubCategory, setNewSubCategory] = useState({
    subCategoryName: "",
    categoryID: "",
    description: "",
  });

  const resolveCategoryId = (categoryRef) =>
    String(categoryRef?._id || categoryRef || "");

  const incomeCategories = categories.filter((c) => c.isIncome);
  const filteredSubCategories = subCategories.filter(
    (sub) => resolveCategoryId(sub.categoryID) === String(formData.categoryID),
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const resolvedUserId =
      currentUser?.userID?._id || currentUser?.userID || currentUser?._id || currentUser?.id;

    const newIncome = {
      id: Date.now(),
      userID: resolvedUserId,
      ...formData,
      peopleID: formData.peopleID || (isEmployeeLogin ? currentPeopleId : ""),
      amount: Number(formData.amount),
      projectID: formData.projectID || null,
      subCategoryID: formData.subCategoryID || null,
    };

    setIncomes([...incomes, newIncome]);
    navigate("/income");
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
      setNewCategory({ categoryName: "", isExpense: false, isIncome: true, description: "" });
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
      isExpense: false,
      isIncome: true,
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
      <div className="row justify-content-center">
        <div className="card glass-card hover-lift p-4 p-md-5" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h3 className="mb-4 fw-bold" style={{ color: 'var(--text-primary)' }}>Record Income</h3>
          <form onSubmit={handleSubmit} className="income-add-form">
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
                  style={{ color: formData.incomeDate ? 'var(--text-primary)' : 'var(--text-muted)' }}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Amount</label>
                <div className="input-group">
                  <span className="input-group-text" style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--text-primary)'
                  }}>₹</span>
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
                        <option key={p.id || p._id} value={p.id || p._id}>
                          {p.peopleName}
                        </option>
                      ))}
                  </select>
                )}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Project</label>
                <select
                  className="form-select"
                  value={formData.projectID}
                  onChange={(e) =>
                    setFormData({ ...formData, projectID: e.target.value })
                  }
                  style={{ color: formData.projectID ? 'var(--text-primary)' : 'var(--text-muted)' }}
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
                    setFormData({
                      ...formData,
                      categoryID: e.target.value,
                      subCategoryID: "",
                    })
                  }
                  style={{ color: formData.categoryID ? 'var(--text-primary)' : 'var(--text-muted)' }}
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
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label small fw-bold mb-0" style={{ color: 'var(--text-secondary)' }}>Sub-Category</label>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-emerald"
                    onClick={() => {
                      if (!formData.categoryID) {
                        alert('Please select a category first');
                        return;
                      }
                      setNewSubCategory({ ...newSubCategory, categoryID: formData.categoryID });
                      setShowSubCategoryModal(true);
                    }}
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
                  value={formData.subCategoryID}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subCategoryID: e.target.value,
                    })
                  }
                  disabled={!formData.categoryID}
                  style={{ color: formData.subCategoryID ? 'var(--text-primary)' : 'var(--text-muted)' }}
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

            <button type="submit" className="btn btn-emerald w-100 shadow-sm">
              Save Income
            </button>
          </form>
        </div>
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

export default IncomeAdd;
