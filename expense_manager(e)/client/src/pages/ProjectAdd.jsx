import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ProjectAdd({ projects, setProjects }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    projectName: "",
    projectStartDate: "",
    projectEndDate: "",
    projectDetail: "",
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProject = {
      id: Date.now(),
      ...formData,
    };
    setProjects([...projects, newProject]);
    navigate("/projects");
  };

  return (
    <div className="container mt-5 fade-in">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card custom-card p-4">
            <h3 className="mb-4">Create New Project</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold">Project Name</label>
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
                  <label className="form-label fw-bold">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.projectStartDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        projectStartDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.projectEndDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        projectEndDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Project Details</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={formData.projectDetail}
                  onChange={(e) =>
                    setFormData({ ...formData, projectDetail: e.target.value })
                  }
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">
                  Description (Optional)
                </label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary w-100 shadow-sm">
                Save Project
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectAdd;
