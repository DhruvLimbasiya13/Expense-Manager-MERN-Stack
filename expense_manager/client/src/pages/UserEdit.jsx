import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { putData } from "../services/api";

function UserEdit({ users, setUsers }) {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Find user from local state (passed from App.jsx) to pre-fill
  const existingUser = users.find(u => u._id === id);

  const [formData, setFormData] = useState({
    userName: "",
    emailAddress: "",
    role: "normal_user",
    mobileNo: ""
  });

  useEffect(() => {
    if (existingUser) {
      setFormData({
        userName: existingUser.userName || existingUser.name || "",
        emailAddress: existingUser.emailAddress || existingUser.email || "",
        role: existingUser.role || "normal_user",
        mobileNo: existingUser.mobileNo || ""
      });
    }
  }, [existingUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await putData(`/auth/${id}`, formData);
      
      // Update local state
      if (setUsers) {
        setUsers(users.map(u => u._id === id ? updatedUser : u));
      }

      navigate('/users');
    } catch (err) {
      console.error(err);
      alert("Failed to update user.");
    }
  };

  if (!existingUser) return <div className="text-center mt-5 text-secondary">Loading user...</div>;

  return (
    <div className="container mt-5 fade-in-up">
      <div className="card glass-card hover-lift p-4 p-md-5" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h3 className="mb-4 fw-bold" style={{ color: 'var(--text-primary)' }}>Edit User</h3>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-4">
                <label className="form-label small fw-bold" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
                <input
                type="text"
                className="form-control glass-input"
                required
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                />
            </div>
            <div className="col-md-6 mb-4">
                <label className="form-label small fw-bold" style={{ color: 'var(--text-secondary)' }}>Email Address</label>
                <input
                type="email"
                className="form-control glass-input"
                required
                value={formData.emailAddress}
                onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                />
            </div>
            <div className="col-md-6 mb-4">
                <label className="form-label small fw-bold" style={{ color: 'var(--text-secondary)' }}>Role</label>
                <select 
                    className="form-select glass-input"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                    <option value="normal_user">Normal User (Employee)</option>
                    <option value="admin">Administrator</option>
                </select>
            </div>
            <div className="col-md-6 mb-4">
                <label className="form-label small fw-bold" style={{ color: 'var(--text-secondary)' }}>Mobile No</label>
                <input
                type="text"
                className="form-control glass-input"
                value={formData.mobileNo}
                onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                />
            </div>
          </div>

          <div className="d-flex justify-content-end mt-2">
             <button type="button" className="btn btn-outline-light me-2 border-0" onClick={() => navigate('/users')}>
                Cancel
             </button>
             <button type="submit" className="btn btn-premium shadow-lg px-4">
                Update User
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserEdit;
