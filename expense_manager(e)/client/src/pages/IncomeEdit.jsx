import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function IncomeEdit({ incomes, setIncomes, projects, categories, subCategories }) {
  const navigate = useNavigate();
  const { id } = useParams();

  // Find data immediately
  const existingIncome = incomes.find((i) => Number(i.id) === Number(id));

  // Lazy Init State
  const [formData, setFormData] = useState(() => {
    if (existingIncome) {
      return {
        date: existingIncome.date,
        amount: existingIncome.amount,
        projectId: existingIncome.projectId,
        categoryId: existingIncome.categoryId,
        subCategoryId: existingIncome.subCategoryId || "",
        remarks: existingIncome.remarks || existingIncome.description || existingIncome.source || "",
      };
    }
    return {
      date: "",
      amount: "",
      projectId: "",
      categoryId: "",
      subCategoryId: "",
      remarks: "",
    };
  });

  useEffect(() => {
    if (!existingIncome) {
      navigate("/income");
    }
  }, [existingIncome, navigate]);

  const incomeCategories = categories.filter(c => c.isIncome);
  const filteredSubCategories = subCategories.filter(
    (sub) => Number(sub.categoryId) === Number(formData.categoryId)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedIncomes = incomes.map((inc) => 
        Number(inc.id) === Number(id) 
        ? { 
            ...inc, 
            ...formData, 
            amount: Number(formData.amount), 
            projectId: Number(formData.projectId), 
            categoryId: Number(formData.categoryId), 
            subCategoryId: Number(formData.subCategoryId) 
          } 
        : inc
    );
    setIncomes(updatedIncomes);
    navigate("/income");
  };

  if (!existingIncome) return null;

  return (
    <div className="container mt-5 fade-in">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card custom-card p-4">
            <h3 className="mb-4">Edit Income</h3>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Date</label>
                    <input type="date" className="form-control" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Amount</label>
                    <div className="input-group">
                        <span className="input-group-text">₹</span>
                        <input type="number" className="form-control" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                    </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Project</label>
                <select className="form-select" required value={formData.projectId} onChange={e => setFormData({...formData, projectId: e.target.value})}>
                  <option value="">Select Project</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Category</label>
                  <select className="form-select" required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value, subCategoryId: ""})}>
                    <option value="">Select Category</option>
                    {incomeCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Sub-Category</label>
                  <select className="form-select" value={formData.subCategoryId} onChange={e => setFormData({...formData, subCategoryId: e.target.value})} disabled={!formData.categoryId}>
                    <option value="">Select Sub-Category</option>
                    {filteredSubCategories.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">Remarks</label>
                <textarea className="form-control" rows="2" value={formData.remarks} onChange={e => setFormData({...formData, remarks: e.target.value})}></textarea>
              </div>

              <div className="d-flex gap-2">
                  <button type="button" className="btn btn-light w-50 border" onClick={() => navigate("/income")}>Cancel</button>
                  <button type="submit" className="btn btn-primary w-50">Update Income</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncomeEdit;