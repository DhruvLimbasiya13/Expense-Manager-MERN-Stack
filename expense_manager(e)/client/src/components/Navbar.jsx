import { Link, NavLink } from "react-router-dom";

function Navbar({ currentUser, onLogout }) {
  const isAdmin = currentUser?.role === "admin";

  // FIX: Check for both 'userName' AND 'name', fallback to "User"
  const displayName = currentUser?.userName || currentUser?.name || "User";

  return (
    <nav className="navbar navbar-expand-lg shadow-sm mb-4" style={{
      background: 'rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/" style={{
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '1.5rem'
        }}>
          Expensify
        </Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* ... Keep your links here ... */}
            <li className="nav-item">
              <NavLink className="nav-link" to="/" style={({ isActive }) => ({
                color: isActive ? 'var(--gold)' : 'var(--text-secondary)',
                fontWeight: isActive ? '600' : '400'
              })}>
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/projects" style={({ isActive }) => ({
                color: isActive ? 'var(--gold)' : 'var(--text-secondary)',
                fontWeight: isActive ? '600' : '400'
              })}>
                Projects
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/expenses" style={({ isActive }) => ({
                color: isActive ? 'var(--gold)' : 'var(--text-secondary)',
                fontWeight: isActive ? '600' : '400'
              })}>
                Expenses
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/income" style={({ isActive }) => ({
                color: isActive ? 'var(--gold)' : 'var(--text-secondary)',
                fontWeight: isActive ? '600' : '400'
              })}>
                Income
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/categories" style={({ isActive }) => ({
                color: isActive ? 'var(--gold)' : 'var(--text-secondary)',
                fontWeight: isActive ? '600' : '400'
              })}>
                Categories
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
            <div className="text-end" style={{ color: 'var(--text-primary)' }}>
              <div className="fw-bold small">{displayName}</div>
              <div className="small" style={{ color: 'var(--text-secondary)' }}>
                {isAdmin ? "Admin" : "Employee"}
              </div>
            </div>
            {/* FIX: Use displayName for initial */}
            <div
              className="text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style={{ 
                width: "35px", 
                height: "35px",
                background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))'
              }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={onLogout}
              className="btn btn-coral btn-sm fw-bold ms-2"
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
