import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

function Navbar({ currentUser, onLogout }) {
  const location = useLocation();

  const linkStyle = {
    textDecoration: "none",
    color: "#6b7280", // Gray-500
    fontWeight: "500",
    padding: "0.5rem 0.75rem",
    borderRadius: "8px",
    transition: "all 0.2s",
    fontSize: "0.9rem",
  };

  const activeStyle = {
    ...linkStyle,
    color: "#4f46e5", // Indigo-600
    backgroundColor: "#eff6ff", // Blue-50
    fontWeight: "600",
  };

  const getStyle = (path) => {
    if (path === "/")
      return location.pathname === "/" ? activeStyle : linkStyle;
    return location.pathname.includes(path) ? activeStyle : linkStyle;
  };

  const isAdmin = currentUser?.role === "admin";

  return (
    <nav
      className="navbar navbar-expand-lg sticky-top bg-white border-bottom"
      style={{ boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)" }}
    >
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center me-4" to="/">
          <img
            src={logo}
            alt="Logo"
            width="32"
            height="32"
            className="me-2 rounded shadow-sm"
          />
          <span
            className="fw-bold fs-5 text-dark"
            style={{ letterSpacing: "-0.5px" }}
          >
            Expensify
          </span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0 p-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Links */}
          <div className="navbar-nav me-auto gap-1">
            <Link to="/" style={getStyle("/")}>
              Dashboard
            </Link>
            <Link to="/expenses" style={getStyle("/expenses")}>
              Expenses
            </Link>
            <Link to="/income" style={getStyle("/income")}>
              Income
            </Link>
            <div className="vr d-none d-lg-block mx-2 my-auto h-50 opacity-25"></div>
            <Link to="/projects" style={getStyle("/projects")}>
              Projects
            </Link>

            <Link to="/categories" style={getStyle("/categories")}>
              Categories
            </Link>
          </div>

          {/* User Profile & Logout */}
          <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
            {currentUser && (
              <div className="d-flex align-items-center text-end">
                <div className="d-none d-md-block me-3">
                  <div className="fw-bold text-dark small">
                    {currentUser.name}
                  </div>
                  <div
                    className="text-muted d-flex justify-content-end align-items-center gap-1"
                    style={{
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {isAdmin ? (
                      <span className="text-primary fw-bold">Admin</span>
                    ) : (
                      <span>User</span>
                    )}
                  </div>
                </div>
                <div
                  className="bg-gradient bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm"
                  style={{ width: "38px", height: "38px", fontSize: "0.9rem" }}
                >
                  {currentUser.name.charAt(0)}
                </div>
              </div>
            )}

            <button
              onClick={onLogout}
              className="btn btn-outline-danger btn-sm px-3 fw-medium"
              style={{ borderRadius: "6px" }}
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
