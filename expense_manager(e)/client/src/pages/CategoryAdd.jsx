import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postData } from "../services/api";

function CategoryAdd({ categories, setCategories, currentUser }) {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        categoryName: "",
        isExpense: true,
        isIncome: false,
        description: "",
        isActive: true,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...formData,
            userID: currentUser._id || currentUser.id,
            sequence: categories.length + 1,
        };

        try {
            const saved = await postData("/categories", payload);
            setCategories([...categories, saved]);
            navigate("/categories");
        } catch (err) {
            alert("Error saving category: " + err.message);
        }
    };

    return (
        <div className="container mt-5 fade-in-up">
            <div className="card glass-card hover-lift p-4 p-md-5" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h3 className="mb-4 fw-bold" style={{ color: 'var(--text-primary)' }}>Add New Category</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label small fw-bold" style={{ color: 'var(--text-secondary)' }}>Category Name</label>
                        <input
                            type="text"
                            className="form-control"
                            required
                            value={formData.categoryName}
                            onChange={(e) =>
                                setFormData({ ...formData, categoryName: e.target.value })
                            }
                            placeholder="Enter category name"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label small fw-bold" style={{ color: 'var(--text-secondary)' }}>Category Type</label>
                        <div className="d-flex gap-3">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="isExpense"
                                    checked={formData.isExpense}
                                    onChange={(e) =>
                                        setFormData({ ...formData, isExpense: e.target.checked })
                                    }
                                />
                                <label className="form-check-label" htmlFor="isExpense" style={{ color: 'var(--text-primary)' }}>
                                    Expense
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="isIncome"
                                    checked={formData.isIncome}
                                    onChange={(e) =>
                                        setFormData({ ...formData, isIncome: e.target.checked })
                                    }
                                />
                                <label className="form-check-label" htmlFor="isIncome" style={{ color: 'var(--text-primary)' }}>
                                    Income
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label small fw-bold" style={{ color: 'var(--text-secondary)' }}>Description (Optional)</label>
                        <textarea
                            className="form-control"
                            rows="3"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            placeholder="Enter description"
                        ></textarea>
                    </div>

                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-emerald flex-grow-1">
                            Save Category
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CategoryAdd;
