import { useNavigate } from "react-router-dom";

function ProjectList({ projects }) {
  const navigate = useNavigate();

  return (
    <div className="container mt-5 fade-in-up">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 style={{ color: 'var(--text-primary)' }}>Projects</h2>
          <p className="text-secondary">
            Overview of all ongoing projects and departments.
          </p>
        </div>

        <button
          className="btn btn-premium shadow-sm"
          onClick={() => navigate("/projects/add")}
        >
          + New Project
        </button>
      </div>

      <div className="card glass-card hover-lift p-0 border-0 overflow-hidden ">
        <div className="table-responsive no-scrollbar">
          <table className="table table-hover mb-0 align-middle ">
            <thead>
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
                  <td className="p-3 ps-4 fw-bold" style={{ color: 'var(--accent-cyan)' }}>
                    {project.name}
                  </td>
                  <td className="p-3 text-secondary">{project.startDate || "-"}</td>
                  <td className="p-3 text-secondary">{project.endDate || "-"}</td>
                  <td className="p-3 text-secondary small">
                    {project.description}
                  </td>
                  <td className="p-3 text-end pe-4">
                    <button className="btn btn-sm btn-premium">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-secondary">
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
