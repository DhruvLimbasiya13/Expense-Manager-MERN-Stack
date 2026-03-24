import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { putData } from "../services/api";

function IncomeEdit({ incomes, setIncomes, projects, categories, subCategories }) {
  const navigate = useNavigate();
  const { id } = useParams();

  // Find income by MongoDB _id (string match)
  const existingIncome = incomes.find((i) => String(i._id) === String(id));

  // Lazy Init State
  const [formData, setFormData] = useState(() => {
    if (existingIncome) {
      return {
        incomeDate: existingIncome.incomeDate ? new Date(existingIncome.incomeDate).toISOString().split('T')[0] : "",
        amount: existingIncome.amount,
        projectID: existingIncome.projectID?._id || existingIncome.projectID || "",
        categoryID: existingIncome.categoryID?._id || existingIncome.categoryID || "",
        subCategoryID: existingIncome.subCategoryID?._id || existingIncome.subCategoryID || "",
        incomeDetail: existingIncome.incomeDetail || existingIncome.description || "",
      };
    }
    return {
      incomeDate: "",
      amount: "",
      projectID: "",
      categoryID: "",
      subCategoryID: "",
      incomeDetail: "",
    };
  });

  useEffect(() => {
    if (!existingIncome) {
      navigate("/income");
    }
  }, [existingIncome, navigate]);

  const incomeCategories = categories.filter(c => c.isIncome);
  const filteredSubCategories = subCategories.filter(
    (sub) => {
      const subCatId = sub.categoryID?._id || sub.categoryID;
      return String(subCatId) === String(formData.categoryID);
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      incomeDate: formData.incomeDate,
      amount: Number(formData.amount),
      projectID: formData.projectID || null,
      categoryID: formData.categoryID || null,
      subCategoryID: formData.subCategoryID || null,
      incomeDetail: formData.incomeDetail,
    };

    try {
      const updated = await putData(`/incomes/${id}`, payload);
      setIncomes(incomes.map((inc) =>
        String(inc._id) === String(id) ? { ...inc, ...updated } : inc
      ));
      navigate("/income");
    } catch (err) {
      alert("Error updating income: " + err.message);
    }
  };

  if (!existingIncome) return null;

  return (
    <div className="container mt-5 fade-in-up">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card glass-card hover-lift p-4 p-md-5">
            <h3 className="mb-4 fw-bold" style={{ color: 'var(--text-primary)' }}>Edit Income</h3>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold" style={{ color: 'var(--text-secondary)' }}>Date</label>
                  <input type="date" className="form-control glass-input" required value={formData.incomeDate} onChange={e => setFormData({ ...formData, incomeDate: e.target.value })} />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold" style={{ color: 'var(--text-secondary)' }}>Amount</label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}>₹</span>
                    <input type="number" className="form-control glass-input" required value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold" style={{ color: 'var(--text-secondary)' }}>Project</label>
                <select className="form-select glass-input" value={formData.projectID} onChange={e => setFormData({ ...formData, projectID: e.target.value })}>
                  <option value="" style={{ color: '#000' }}>Select Project</option>
                  {projects.map(p => <option key={p._id} value={p._id} style={{ color: '#000' }}>{p.projectName}</option>)}
                </select>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold" style={{ color: 'var(--text-secondary)' }}>Category</label>
                  <select className="form-select glass-input" required value={formData.categoryID} onChange={e => setFormData({ ...formData, categoryID: e.target.value, subCategoryID: "" })}>
                    <option value="" style={{ color: '#000' }}>Select Category</option>
                    {incomeCategories.map(c => <option key={c._id} value={c._id} style={{ color: '#000' }}>{c.categoryName}</option>)}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold" style={{ color: 'var(--text-secondary)' }}>Sub-Category</label>
                  <select className="form-select glass-input" value={formData.subCategoryID} onChange={e => setFormData({ ...formData, subCategoryID: e.target.value })} disabled={!formData.categoryID}>
                    <option value="" style={{ color: '#000' }}>Select Sub-Category</option>
                    {filteredSubCategories.map(sub => <option key={sub._id} value={sub._id} style={{ color: '#000' }}>{sub.subCategoryName}</option>)}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold" style={{ color: 'var(--text-secondary)' }}>Remarks</label>
                <textarea className="form-control glass-input" rows="2" value={formData.incomeDetail} onChange={e => setFormData({ ...formData, incomeDetail: e.target.value })}></textarea>
              </div>

              <div className="d-flex justify-content-end gap-3 mt-4">
                <button type="button" className="btn btn-outline-light border-0" onClick={() => navigate("/income")}>Cancel</button>
                <button type="submit" className="btn btn-emerald shadow-lg px-4">Update Income</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncomeEdit;