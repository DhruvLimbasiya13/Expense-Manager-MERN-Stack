import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postData } from "../services/api";

function UserAdd({ setUsers }) { // Accept setUsers to update state
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    emailAddress: "",
    password: "",
    role: "normal_user",
    mobileNo: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newUser = await postData('/auth/register', formData); // Reusing register endpoint
      
      // Update local users state if setUsers is provided
      if(setUsers) {
        setUsers(prev => [...prev, newUser]);
      }

      navigate('/users');
    } catch (err) {
      console.error(err);
      alert("Failed to create user. Email might be duplicate.");
    }
  };

  return (
    <div className="container mt-5 fade-in-up">
      <div className="card glass-card hover-lift p-4 p-md-5" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h3 className="mb-4 fw-bold" style={{ color: 'var(--text-primary)' }}>Create New User</h3>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-4">
                <label className="form-label small fw-bold" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
                <input
                type="text"
                className="form-control glass-input"
                placeholder="e.g. John Doe"
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
                placeholder="e.g. john@example.com"
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
                <label className="form-label small fw-bold" style={{ color: 'var(--text-secondary)' }}>Mobile No (Optional)</label>
                <input
                type="text"
                className="form-control glass-input"
                placeholder="e.g. 9876543210"
                value={formData.mobileNo}
                onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                />
            </div>
            <div className="col-md-12 mb-4">
                <label className="form-label small fw-bold" style={{ color: 'var(--text-secondary)' }}>Default Password</label>
                <input
                type="password"
                className="form-control glass-input"
                placeholder="Create a password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
            </div>
          </div>

          <div className="d-flex justify-content-end mt-2">
             <button type="button" className="btn btn-outline-light me-2 border-0" onClick={() => navigate('/users')}>
                Cancel
             </button>
             <button type="submit" className="btn btn-premium shadow-lg px-4">
                Create User
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserAdd;
