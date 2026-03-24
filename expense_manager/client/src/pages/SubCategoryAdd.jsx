import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postData } from "../services/api";

function SubCategoryAdd({ categories, subCategories, setSubCategories, currentUser }) {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        subCategoryName: "",
        categoryID: "",
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
            sequence: subCategories.length + 1,
        };

        try {
            const saved = await postData("/subcategories", payload);
            setSubCategories([...subCategories, saved]);
            navigate("/categories");
        } catch (err) {
            alert("Error saving sub-category: " + err.message);
        }
    };

    return (
        <div className="container mt-5 fade-in-up">
            <div className="card glass-card hover-lift p-4 p-md-5" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h3 className="mb-4 fw-bold" style={{ color: 'var(--text-primary)' }}>Add New Sub-Category</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label small fw-bold" style={{ color: 'var(--text-secondary)' }}>Parent Category</label>
                        <select
                            className="form-select"
                            required
                            value={formData.categoryID}
                            onChange={(e) => {
                                const selectedCategory = categories.find(c => c._id === e.target.value);
                                setFormData({
                                    ...formData,
                                    categoryID: e.target.value,
                                    isExpense: selectedCategory?.isExpense || false,
                                    isIncome: selectedCategory?.isIncome || false,
                                });
                            }}
                            style={{ color: formData.categoryID ? 'var(--text-primary)' : 'var(--text-muted)' }}
                        >
                            <option value="" style={{ color: 'var(--text-muted)' }}>Select Parent Category</option>
                            {categories.map((c) => (
                                <option key={c._id} value={c._id} style={{ color: 'var(--text-primary)' }}>
                                    {c.categoryName} ({c.isExpense ? 'Expense' : ''}{c.isExpense && c.isIncome ? ' / ' : ''}{c.isIncome ? 'Income' : ''})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label small fw-bold" style={{ color: 'var(--text-secondary)' }}>Sub-Category Name</label>
                        <input
                            type="text"
                            className="form-control"
                            required
                            value={formData.subCategoryName}
                            onChange={(e) =>
                                setFormData({ ...formData, subCategoryName: e.target.value })
                            }
                            placeholder="Enter sub-category name"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label small fw-bold" style={{ color: 'var(--text-secondary)' }}>Type</label>
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
                                    disabled={formData.categoryID !== ""}
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
                                    disabled={formData.categoryID !== ""}
                                />
                                <label className="form-check-label" htmlFor="isIncome" style={{ color: 'var(--text-primary)' }}>
                                    Income
                                </label>
                            </div>
                        </div>
                        {formData.categoryID && (
                            <small className="text-muted">Type is inherited from parent category</small>
                        )}
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
                            Save Sub-Category
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

export default SubCategoryAdd;
