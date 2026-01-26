import { useState } from "react";
import { useNavigate } from "react-router-dom";

function IncomeAdd({ incomes, setIncomes, projects, categories, setCategories, subCategories, setSubCategories, currentUser }) {
  const navigate = useNavigate();
  
  // Category Toggles
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Sub-Category Toggles
  const [isNewSubCategory, setIsNewSubCategory] = useState(false);
  const [newSubCategoryName, setNewSubCategoryName] = useState("");

  const [formData, setFormData] = useState({
    date: "",
    amount: "",
    projectId: "",
    categoryId: "",
    subCategoryId: "",
    remarks: "",
    attachment: "",
  });

  const incomeCategories = categories.filter(c => c.isIncome);

  const filteredSubCategories = subCategories.filter(
    (sub) => sub.categoryId === Number(formData.categoryId)
  );

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFormData({ ...formData, attachment: e.target.files[0].name });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let finalCategoryId = formData.categoryId;
    let finalSubCategoryId = formData.subCategoryId;

    // 1. New Category
    if (isNewCategory && newCategoryName.trim() !== "") {
      const newCat = {
        id: Date.now(),
        name: newCategoryName,
        isExpense: false,
        isIncome: true
      };
      setCategories((prev) => [...prev, newCat]);
      finalCategoryId = newCat.id;
    }

    // 2. New Sub-Category
    if (isNewSubCategory && newSubCategoryName.trim() !== "") {
      const newSubCat = {
        id: Date.now() + 1,
        categoryId: Number(finalCategoryId),
        name: newSubCategoryName
      };
      setSubCategories((prev) => [...prev, newSubCat]);
      finalSubCategoryId = newSubCat.id;
    } else if (isNewSubCategory) {
        finalSubCategoryId = null;
    }

    const newIncome = {
      id: incomes.length + 1,
      userId: currentUser?.id,
      ...formData,
      amount: Number(formData.amount),
      projectId: Number(formData.projectId),
      categoryId: Number(finalCategoryId),
      subCategoryId: finalSubCategoryId ? Number(finalSubCategoryId) : null,
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
                    <label className="form-label fw-bold">Date</label>
                    <input type="date" className="form-control" required 
                      value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Amount</label>
                    <div className="input-group">
                        <span className="input-group-text">₹</span>
                        <input type="number" className="form-control" required 
                        value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                    </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Project</label>
                <select className="form-select" required
                  value={formData.projectId} onChange={e => setFormData({...formData, projectId: e.target.value})}>
                  <option value="">Select Project</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>

              {/* Category & Sub-Category Row */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label fw-bold mb-0">Category</label>
                    <button 
                      type="button" 
                      className="btn btn-link btn-sm p-0 text-decoration-none"
                      onClick={() => {
                        setIsNewCategory(!isNewCategory);
                        setFormData({...formData, categoryId: "", subCategoryId: ""});
                        setIsNewSubCategory(false);
                        setNewCategoryName("");
                      }}
                    >
                      {isNewCategory ? "Select Existing" : "+ Enter New"}
                    </button>
                  </div>
                  
                  {isNewCategory ? (
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Type new category..."
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      required
                    />
                  ) : (
                    <select className="form-select" required
                      value={formData.categoryId} 
                      onChange={e => setFormData({...formData, categoryId: e.target.value, subCategoryId: ""})}>
                      <option value="">Select Category</option>
                      {incomeCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label fw-bold mb-0">Sub-Category</label>
                    <button 
                      type="button" 
                      className="btn btn-link btn-sm p-0 text-decoration-none"
                      onClick={() => {
                         setIsNewSubCategory(!isNewSubCategory);
                         setFormData({...formData, subCategoryId: ""});
                         setNewSubCategoryName("");
                      }}
                    >
                      {isNewSubCategory ? "Select Existing" : "+ Enter New"}
                    </button>
                  </div>

                  {isNewSubCategory ? (
                     <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Type new sub-category..."
                      value={newSubCategoryName}
                      onChange={(e) => setNewSubCategoryName(e.target.value)}
                      required={isNewSubCategory} 
                    />
                  ) : (
                    <select className="form-select" 
                        value={formData.subCategoryId} 
                        onChange={e => setFormData({...formData, subCategoryId: e.target.value})}
                        disabled={isNewCategory || !formData.categoryId}
                    >
                        <option value="">Select Sub-Category</option>
                        {filteredSubCategories.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                    </select>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Attachment</label>
                <input type="file" className="form-control" onChange={handleFileChange} />
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">Remarks</label>
                <textarea className="form-control" rows="2"
                  value={formData.remarks} onChange={e => setFormData({...formData, remarks: e.target.value})}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary w-100 shadow-sm">Save Income</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncomeAdd;