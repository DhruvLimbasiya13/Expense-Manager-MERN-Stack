import { Link, NavLink } from "react-router-dom";

function Navbar({ currentUser, onLogout }) {
  const isAdmin = currentUser?.role === "admin";

  // FIX: Check for both 'userName' AND 'name', fallback to "User"
  const displayName = currentUser?.userName || currentUser?.name || "User";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm mb-4">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          Expensify
        </Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* ... Keep your links here ... */}
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/projects">
                Projects
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/expenses">
                Expenses
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/income">
                Income
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/categories">
                Categories
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
            <div className="text-white text-end">
              <div className="fw-bold small">{displayName}</div>
              <div className="small opacity-75">
                {isAdmin ? "Admin" : "Employee"}
              </div>
            </div>
            {/* FIX: Use displayName for initial */}
            <div
              className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style={{ width: "35px", height: "35px" }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={onLogout}
              className="btn btn-light btn-sm fw-bold text-primary ms-2"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
