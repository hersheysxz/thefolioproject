import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate for redirection
import API from "../api/axios";

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // Changed from username
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [dob, setDob] = useState("");
  const [level, setLevel] = useState("");
  const [terms, setTerms] = useState(false);

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => { // Added async
    e.preventDefault();
    let newErrors = {};

    // Validation Logic
    if (!name) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required"; // Updated
    if (!password) newErrors.password = "Password is required";
    if (confirm !== password) newErrors.confirm = "Passwords do not match";

    if (!dob) {
      newErrors.dob = "Please select birth date";
    } else {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) newErrors.dob = "You must be 18 or older to register";
    }

    if (!level) newErrors.level = "Select expertise level";
    if (!terms) newErrors.terms = "You must accept the terms";

    setErrors(newErrors);

    // If no errors, send to Backend
    if (Object.keys(newErrors).length === 0) {
      try {
        // Backend expects: name, email, password
        await API.post("/auth/register", { name, email, password });

        alert("Registration Successful!");
        navigate("/login"); // Redirect to login page after success
      } catch (err) {
        // Handle backend errors (e.g., Email already exists)
        setErrors({ server: err.response?.data?.message || "Registration Failed" });
      }
    }
  };

  return (
    <div>
      <main className="content-limit" style={{ paddingTop: "120px" }}>
        <section className="intro-box">
          <h2 className="section-heading">Collector Registration</h2>
          <div className="heading-line"></div>
          <p className="register-description">Register to write posts, leave comments, and join our art session.</p>

          {/* Show Server Errors if any */}
          {errors.server && <p style={{ color: "red", textAlign: "center" }}>{errors.server}</p>}

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-sections">
              
              {/* PERSONAL INFO SECTION */}
              <div className="form-section">
                <h3 className="section-title">👤 Personal Information</h3>
                <div className="form-grid">
                  
                  <div className="input-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <span className="error">{errors.name}</span>
                  </div>

                  {/* CHANGED FROM USERNAME TO EMAIL */}
                  <div className="input-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      placeholder="example@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <span className="error">{errors.email}</span>
                  </div>

                </div>
              </div>

              {/* SECURITY SECTION */}
              <div className="form-section">
                <h3 className="section-title">🔒 Security</h3>
                <div className="form-grid">
                  <div className="input-group">
                    <label>Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span className="error">{errors.password}</span>
                  </div>
                  <div className="input-group">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                    />
                    <span className="error">{errors.confirm}</span>
                  </div>
                </div>
              </div>

              {/* PROFILE SECTION */}
              <div className="form-section">
                <h3 className="section-title">🎨 Profile Details</h3>
                <div className="form-grid">
                  <div className="input-group">
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                    />
                    <span className="error">{errors.dob}</span>
                  </div>

                  <div className="input-group">
                    <label>Expertise Level</label>
                    <div className="radio-grid">
                      {["Beginner", "Intermediate", "Expert"].map((lvl) => (
                        <label className="radio-option" key={lvl}>
                          <input
                            type="radio"
                            name="lvl"
                            value={lvl}
                            onChange={(e) => setLevel(e.target.value)}
                          />
                          <span className="radio-label">{lvl}</span>
                        </label>
                      ))}
                    </div>
                    <span className="error">{errors.level}</span>
                  </div>
                </div>
              </div>

            </div>

            <div className="terms-section">
              <div className="check-wrap">
                <input
                  type="checkbox"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                />
                <label>I agree to the terms and conditions</label>
                <span className="error">{errors.terms}</span>
              </div>
            </div>

            <button type="submit" className="submit-btn">Create Account</button>
            <p className="login-link">Already have an account? <Link to="/login">Login here</Link></p>
          </form>
        </section>
      </main>

      <footer className="footer">
        <p>Contact: rachelregacho645@gmail.com | Instagram: @almostreal</p>
        <p>© 2026 Almost Real Portfolio</p>
      </footer>
    </div>
  );
}

export default RegisterPage;