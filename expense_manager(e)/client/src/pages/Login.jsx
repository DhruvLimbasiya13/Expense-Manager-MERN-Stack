import { useState } from "react";
import { postData } from "../services/api";

function Login({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("normal_user");
  const [mobileNo, setMobileNo] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    console.log("Login form submitted");
    console.log("Mode:", isRegistering ? "Registering" : "Logging in");

    try {
      if (isRegistering) {
        // --- REGISTER API CALL ---
        console.log("Attempting Registration...");
        // CRITICAL FIX: Mapping frontend state to Backend Schema keys
        const newUser = {
          userName: name,       // Backend expects 'userName'
          emailAddress: email,  // Backend expects 'emailAddress'
          password: password,
          role: role,
          mobileNo: mobileNo || ""
        };
        console.log("Register Payload:", newUser);

        await postData('/auth/register', newUser);
        console.log("Registration API Success");

        alert("Registration Successful! Please Login.");
        setIsRegistering(false);
      } else {
        // --- LOGIN API CALL ---
        console.log("Attempting Login...");
        const credentials = { email: email, password: password };
        console.log("Login Payload:", credentials);

        const user = await postData('/auth/login', credentials);
        console.log("Login API Response:", user);

        if (user) {
          onLogin(user);
        } else {
          throw new Error("Login failed: No user data returned");
        }
      }
    } catch (err) {
      console.error("Login Error Catch:", err);
      // Detailed error message for user
      const msg = err.message || "Request Failed. Check connection or credentials.";
      setError(msg);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{
      background: 'linear-gradient(135deg, #0b0e14 0%, #1a1f2e 50%, #0b0e14 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
        top: '-10%',
        right: '-10%',
        borderRadius: '50%',
        animation: 'pulse 4s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
        bottom: '-10%',
        left: '-10%',
        borderRadius: '50%',
        animation: 'pulse 5s ease-in-out infinite'
      }}></div>

      <div className="glass-card fade-in-up p-4 p-md-5" style={{ maxWidth: "450px", width: "90%", zIndex: 1 }}>

        <div className="text-center mb-4">
          <h3 className="fw-bold mb-2" style={{
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '2rem'
          }}>Expensify</h3>
          <p className="text-secondary">
            {isRegistering ? "Create your account" : "Manage your expenses with premium fintech"}
          </p>
        </div>

        {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Full Name</label>
                  <input
                    type="text" className="form-control glass-input" placeholder="John Doe"
                    value={name} onChange={e => setName(e.target.value)} required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Mobile Number</label>
                  <input
                    type="text" className="form-control glass-input" placeholder="9876543210"
                    value={mobileNo} onChange={e => setMobileNo(e.target.value)} required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold d-block">Register As</label>
                <div className="d-flex gap-4">
                  <div className="form-check">
                    <input
                      className="form-check-input" type="radio" name="role" id="roleNormal"
                      value="normal_user" checked={role === "normal_user"}
                      onChange={(e) => setRole(e.target.value)}
                    />
                    <label className="form-check-label text-secondary" htmlFor="roleNormal">
                      Employee
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input" type="radio" name="role" id="roleAdmin"
                      value="admin" checked={role === "admin"}
                      onChange={(e) => setRole(e.target.value)}
                    />
                    <label className="form-check-label text-secondary" htmlFor="roleAdmin">
                      Admin
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="mb-3">
            <label className="form-label small fw-bold d-block">Login As</label>
            <div className="d-flex gap-4">
              <div className="form-check">
                <input
                  className="form-check-input" type="radio" name="role" id="roleNormal"
                  value="normal_user" checked={role === "normal_user"}
                  onChange={(e) => setRole(e.target.value)}
                />
                <label className="form-check-label text-secondary" htmlFor="roleNormal">
                  Employee
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input" type="radio" name="role" id="roleAdmin"
                  value="admin" checked={role === "admin"}
                  onChange={(e) => setRole(e.target.value)}
                />
                <label className="form-check-label text-secondary" htmlFor="roleAdmin">
                  Admin
                </label>
              </div>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold">Email Address</label>
            <input
              type="email" className="form-control glass-input" placeholder="name@example.com"
              value={email} onChange={e => setEmail(e.target.value)} required
            />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-bold">Password</label>
            <input
              type="password" className="form-control glass-input" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)} required
            />
          </div>

          <button type="submit" className="btn btn-premium w-100 fw-bold shadow-sm">
            {isRegistering ? "Sign Up" : "Login"}
          </button>
        </form>

        <div className="text-center mt-4 pt-3" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <small className="fw-bold" style={{ color: 'var(--text-secondary)' }}>
            {isRegistering ? "Already have an account?" : "Don't have an account?"}
          </small>
          <button
            className="btn btn-link btn-sm fw-bold text-decoration-none"
            style={{ color: 'var(--accent-cyan)' }}
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError("");
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