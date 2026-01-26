import { useState } from "react";
import logo from "../assets/logo.png";

function Login({ onLogin, users, onRegister }) {
  const [isRegistering, setIsRegistering] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // Only for registration
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (isRegistering) {
      // --- REGISTER LOGIC ---
      if (!name || !email || !password) {
        setError("All fields are required.");
        return;
      }
      
      // Check if email already exists
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        setError("Email already registered. Please login.");
        return;
      }

      const newUser = { name, email, password };
      onRegister(newUser);

    } else {
      // --- LOGIN LOGIC ---
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        onLogin(user);
      } else {
        setError("Invalid email or password");
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card border-0 shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="text-center mb-4">
            <img src={logo} alt="Logo" width="60" className="mb-3 rounded" />
            <h3 className="fw-bold text-dark">Expensify</h3>
            <p className="text-muted">
              {isRegistering ? "Create your account" : "Manage your expenses efficiently"}
            </p>
        </div>
        
        {error && <div className="alert alert-danger py-2 small">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <div className="mb-3">
              <label className="form-label fw-bold small">Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
          )}

          <div className="mb-3">
            <label className="form-label fw-bold small">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label className="form-label fw-bold small">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button type="submit" className="btn btn-primary w-100 fw-bold shadow-sm">
            {isRegistering ? "Sign Up" : "Login"}
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top">
          <small className="text-muted">
            {isRegistering ? "Already have an account?" : "Don't have an account?"}
          </small>
          <button 
            className="btn btn-link btn-sm fw-bold text-decoration-none"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError("");
              setEmail("");
              setPassword("");
              setName("");
            }}
          >
            {isRegistering ? "Login here" : "Register now"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;