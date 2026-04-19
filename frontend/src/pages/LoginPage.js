// frontend/src/pages/LoginPage.js
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const user = await login(email, password);

      // Redirect based on role
      navigate(user.role === 'admin' ? '/admin' : '/home');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please try again.'
      );
    }
  };

  return (
    <div>

      {/* MAIN */}
      <main className="content-limit" style={{ paddingTop: "120px" }}>

        <section className="intro-box">

          <h2 className="section-heading">Log in to Almost Real</h2>
          <div className="heading-line"></div>

          <p>Welcome back! Access your account to view posts, leave comments, and participate in our art community.</p>

          {error && <p className="error-msg">{error}</p>}

          <form className="login-form" onSubmit={handleSubmit}>

            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="submit-btn">Login</button>

          </form>

          <p>
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>

          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="footer">
        <p>Contact: rachelregacho645@gmail.com | Instagram: @almostreal</p>
        <p>© 2026 Almost Real Portfolio</p>
      </footer>

    </div>
  );
};

export default LoginPage;