import { useNavigate } from "react-router-dom";
import { deleteData } from "../services/api"; // Assuming deleteData exists or will use generic api call

function UserList({ users, setUsers }) { // Accept setUsers to update state locally after delete
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteData(`/auth/${id}`);
        // Update local state
        setUsers(users.filter(u => u._id !== id));
      } catch (err) {
        console.error("Failed to delete user", err);
        alert("Failed to delete user");
      }
    }
  };

  return (
    <div className="container mt-5 fade-in-up">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 style={{ color: 'var(--text-primary)' }}>User Management</h2>
          <p className="text-secondary">
            Manage system access and employee roles.
          </p>
        </div>

        <button
          className="btn btn-premium shadow-sm"
          onClick={() => navigate("/users/add")}
        >
          + New User
        </button>
      </div>

      <div className="card glass-card hover-lift p-0 border-0 overflow-hidden">
        <div className="table-responsive no-scrollbar">
          <table className="table table-hover mb-0 align-middle">
            <thead>
              <tr>
                <th className="p-3 border-0 ps-4">User</th>
                <th className="p-3 border-0">Email</th>
                <th className="p-3 border-0">Role</th>
                <th className="p-3 border-0">Mobile</th>
                <th className="p-3 border-0 text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                  const displayName = user.userName || user.name || "Unknown";
                  return (
                    <tr key={user._id}>
                      <td className="p-3 ps-4">
                        <div className="d-flex align-items-center">
                            <div
                            className="text-white rounded-circle d-flex align-items-center justify-content-center me-3 fw-bold"
                            style={{
                                width: "40px",
                                height: "40px",
                                background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))'
                            }}
                            >
                            {displayName.charAt(0).toUpperCase()}
                            </div>
                            <span className="fw-bold" style={{ color: 'var(--text-primary)' }}>
                            {displayName}
                            </span>
                        </div>
                      </td>
                      <td className="p-3 text-secondary">{user.emailAddress || user.email}</td>
                      <td className="p-3">
                         <span
                            className={`badge ${user.role === "admin" ? "bg-gold" : "bg-secondary"} rounded-pill px-3`}
                            style={user.role === "admin" ? { color: '#000' } : {}}
                         >
                            {user.role}
                         </span>
                      </td>
                      <td className="p-3 text-secondary small">
                        {user.mobileNo || "-"}
                      </td>
                      <td className="p-3 text-end pe-4">
                        <button 
                            className="btn btn-sm btn-outline-light me-2"
                            onClick={() => navigate(`/users/edit/${user._id}`)}
                        >
                          Edit
                        </button>
                        <button 
                            className="btn btn-sm btn-coral"
                            onClick={() => handleDelete(user._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-secondary">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserList;
