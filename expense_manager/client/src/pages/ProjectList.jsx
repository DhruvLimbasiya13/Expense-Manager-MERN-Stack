import { useNavigate } from "react-router-dom";
import { deleteData } from "../services/api";

function ProjectList({ projects, setProjects, expenses, incomes, currentUser }) {
  const navigate = useNavigate();
  const isAdmin = currentUser?.role === 'admin' || currentUser?.userType === 'admin';

  // Filter to only show projects the user is involved in (has at least one expense or income)
  const myExpenses = isAdmin
    ? expenses
    : expenses.filter(e => {
      const pId = e.peopleID?._id || e.peopleID;
      const uId = e.userID?._id || e.userID;
      return String(pId) === String(currentUser._id) || String(uId) === String(currentUser._id);
    });

  const myIncomes = isAdmin
    ? incomes
    : incomes.filter(i => {
      const pId = i.peopleID?._id || i.peopleID;
      const uId = i.userID?._id || i.userID;
      return String(pId) === String(currentUser._id) || String(uId) === String(currentUser._id);
    });

  // Get unique project IDs that have transactions
  const involvedProjectIds = new Set();
  myExpenses.forEach(e => {
    const pid = e.projectID?._id || e.projectID;
    if (pid) involvedProjectIds.add(String(pid));
  });
  myIncomes.forEach(i => {
    const pid = i.projectID?._id || i.projectID;
    if (pid) involvedProjectIds.add(String(pid));
  });

  // Show only involved projects
  const filteredProjects = projects.filter(p => involvedProjectIds.has(String(p._id)));

  const handleDeleteProject = async (e, projectId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      await deleteData(`/projects/${projectId}`);
      if (setProjects) {
        setProjects(projects.filter((p) => String(p._id) !== String(projectId)));
      }
    } catch (err) {
      console.error("Failed to delete project", err);
      alert("Failed to delete project");
    }
  };

  return (
    <div className="container mt-5 fade-in-up">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 style={{ color: 'var(--text-primary)' }}>
            {isAdmin ? "Projects" : "My Projects"}
          </h2>
          <p className="text-secondary">
            {isAdmin
              ? "Projects with active transactions."
              : "Projects you are involved in."}
          </p>
        </div>

        {isAdmin && (
          <button
            className="btn btn-premium shadow-sm"
            onClick={() => navigate("/projects/add")}
          >
            + New Project
          </button>
        )}
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
              {filteredProjects.map((project) => (
                <tr
                  key={project._id}
                  onClick={() => navigate(`/projects/${project._id}`)}
                  style={{ cursor: "pointer" }}
                  title="Click to view details"
                >
                  <td className="p-3 ps-4 fw-bold" style={{ color: 'var(--accent-cyan)' }}>
                    {project.projectName}
                  </td>
                  <td className="p-3 text-secondary">
                    {project.projectStartDate ? new Date(project.projectStartDate).toLocaleDateString() : "-"}
                  </td>
                  <td className="p-3 text-secondary">
                    {project.projectEndDate ? new Date(project.projectEndDate).toLocaleDateString() : "-"}
                  </td>
                  <td className="p-3 text-secondary small">
                    {project.description || project.projectDetail || "-"}
                  </td>
                  <td className="p-3 text-end pe-4">
                    <div className="d-flex justify-content-end align-items-center gap-2">
                      <button className="btn btn-sm btn-premium">
                        View Details
                      </button>
                      {isAdmin && (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={(e) => handleDeleteProject(e, project._id)}
                          title="Delete Project"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-secondary">
                    {isAdmin ? "No projects with transactions found." : "No projects you are involved in."}
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
