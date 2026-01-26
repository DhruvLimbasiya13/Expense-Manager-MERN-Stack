import { useState } from "react";
import { postData } from "../services/api"; 

function Login({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); 
  const [role, setRole] = useState("normal_user"); 
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegistering) {
        // --- REGISTER API CALL ---
        // CRITICAL FIX: Mapping frontend state to Backend Schema keys
        const newUser = { 
            userName: name,       // Backend expects 'userName'
            emailAddress: email,  // Backend expects 'emailAddress'
            password: password, 
            role: role,
            mobileNo: "0000000000" // Dummy value
        };
        
        await postData('/auth/register', newUser);
        
        alert("Registration Successful! Please Login.");
        setIsRegistering(false);
      } else {
        // --- LOGIN API CALL ---
        const credentials = { email: email, password: password };
        const user = await postData('/auth/login', credentials);
        onLogin(user);
      }
    } catch (err) {
      console.error(err);
      setError("Request Failed. Check connection or credentials.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card border-0 shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
        
        <div className="text-center mb-4">
            <h3 className="fw-bold text-primary">Expensify</h3>
            <p className="text-muted">
              {isRegistering ? "Create your account" : "Manage your expenses"}
            </p>
        </div>
        
        {error && <div className="alert alert-danger py-2 small">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Full Name</label>
                  <input 
                    type="text" className="form-control" placeholder="John Doe"
                    value={name} onChange={e => setName(e.target.value)} required 
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold">Register As</label>
                  <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="normal_user">Employee</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
            </>
          )}

          <div className="mb-3">
            <label className="form-label small fw-bold">Email Address</label>
            <input 
              type="email" className="form-control" placeholder="name@example.com"
              value={email} onChange={e => setEmail(e.target.value)} required 
            />
          </div>
          
          <div className="mb-4">
            <label className="form-label small fw-bold">Password</label>
            <input 
              type="password" className="form-control" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)} required 
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