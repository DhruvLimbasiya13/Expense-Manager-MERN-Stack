import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postData } from "../services/api";

function ProjectAdd({ projects, setProjects, currentUser }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    projectName: "",
    projectStartDate: "",
    projectEndDate: "",
    projectDetail: "",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if currentUser exists
      if (!currentUser) {
        throw new Error("User not logged in. Please refresh and try again.");
      }

      // Extract userID safely
      const userID = currentUser._id || currentUser.id;
      if (!userID) {
        throw new Error("User ID not found. Please log out and log in again.");
      }

      const payload = {
        ...formData,
        userID: userID,
      };

      const savedProject = await postData("/projects", payload);
      setProjects([...projects, savedProject]);
      navigate("/projects");
    } catch (error) {
      console.error("Project creation error:", error);
      alert(`Failed to create project: ${error.message}`);
    }
  };

  return (
    <div className="container mt-5 fade-in-up">
      <div className="card glass-card hover-lift p-4 p-md-5" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h3 className="mb-4 fw-bold" style={{ color: 'var(--text-primary)' }}>Create New Project</h3>
        <form onSubmit={handleSubmit} className="project-add-form">
          <div className="mb-4">
            <label className="form-label small fw-bold" style={{ color: 'var(--text-secondary)' }}>Project Name</label>
            <input
              type="text"
              className="form-control glass-input"
              placeholder="e.g. Website Redesign"
              required
              value={formData.projectName}
              onChange={(e) =>
                setFormData({ ...formData, projectName: e.target.value })
              }
            />
          </div>
          <div className="row">
            <div className="col-md-6 mb-4">
              <label className="form-label small fw-bold" style={{ color: 'var(--text-secondary)' }}>Start Date</label>
              <input
                type="date"
                className="form-control glass-input"
                value={formData.projectStartDate}
                onChange={(e) =>
                  setFormData({ ...formData, projectStartDate: e.target.value })
                }
                style={{
                  color: formData.projectStartDate ? 'var(--text-primary)' : 'var(--text-muted)',
                  opacity: formData.projectStartDate ? 1 : 0.6
                }}
              />
            </div>
            <div className="col-md-6 mb-4">
              <label className="form-label small fw-bold" style={{ color: 'var(--text-secondary)' }}>End Date</label>
              <input
                type="date"
                className="form-control glass-input"
                value={formData.projectEndDate}
                onChange={(e) =>
                  setFormData({ ...formData, projectEndDate: e.target.value })
                }
                style={{
                  color: formData.projectEndDate ? 'var(--text-primary)' : 'var(--text-muted)',
                  opacity: formData.projectEndDate ? 1 : 0.6
                }}
              />
            </div>
          </div>

          <div className="d-flex justify-content-end mt-2">
            <button type="button" className="btn btn-outline-light me-2 border-0" onClick={() => navigate('/projects')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-premium shadow-lg px-4">
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default ProjectAdd;
