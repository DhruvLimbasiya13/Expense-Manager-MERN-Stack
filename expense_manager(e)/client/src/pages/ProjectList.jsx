import { useNavigate } from "react-router-dom";

function ProjectList({ projects }) {
  const navigate = useNavigate();

  return (
    <div className="container mt-5 fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Projects</h2>
          <p className="text-muted">
            Overview of all ongoing projects and departments.
          </p>
        </div>

        <button
          className="btn btn-primary shadow-sm"
          onClick={() => navigate("/projects/add")}
        >
          + New Project
        </button>
      </div>

      <div className="card custom-card p-0 shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="bg-light">
              <tr>
                <th className="p-3 border-0 ps-4">Project Name</th>
                <th className="p-3 border-0">Start Date</th>
                <th className="p-3 border-0">End Date</th>
                <th className="p-3 border-0">Description</th>
                <th className="p-3 border-0 text-end pe-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.id}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  style={{ cursor: "pointer" }}
                  title="Click to view details"
                >
                  <td className="p-3 ps-4 fw-bold text-primary">
                    {project.name}
                  </td>
                  <td className="p-3 text-muted">{project.startDate || "-"}</td>
                  <td className="p-3 text-muted">{project.endDate || "-"}</td>
                  <td className="p-3 text-muted small">
                    {project.description}
                  </td>
                  <td className="p-3 text-end pe-4">
                    <button className="btn btn-sm btn-outline-secondary">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-muted">
                    No projects found.
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

export default ProjectList;
