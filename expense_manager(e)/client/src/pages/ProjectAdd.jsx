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
      const payload = {
        ...formData,
        userID: currentUser._id || currentUser.id,
      };
      const savedProject = await postData("/projects", payload);
      setProjects([...projects, savedProject]);
      navigate("/projects");
    } catch (error) {
      alert(`Failed to create project : ${error.message}`);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card custom-card p-4">
        <h3>New Project</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Project Name</label>
            <input
              type="text"
              className="form-control"
              required
              value={formData.projectName}
              onChange={(e) =>
                setFormData({ ...formData, projectName: e.target.value })
              }
            />
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label>Start Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.projectStartDate}
                onChange={(e) =>
                  setFormData({ ...formData, projectStartDate: e.target.value })
                }
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>End Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.projectEndDate}
                onChange={(e) =>
                  setFormData({ ...formData, projectEndDate: e.target.value })
                }
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Save Project
          </button>
        </form>
      </div>
    </div>
  );
}
export default ProjectAdd;
