// frontend/src/pages/ForgotPasswordPage.js
import { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Placeholder for sending reset email
    // In a real app, call API to send reset link
    if (email) {
      setMessage('If an account with that email exists, a reset link has been sent.');
    } else {
      setError('Please enter your email.');
    }
  };

  return (
    <div>

      {/* MAIN */}
      <main className="content-limit" style={{ paddingTop: "120px" }}>

        <section className="intro-box">

          <h2 className="section-heading">Forgot Password</h2>
          <div className="heading-line"></div>

          <p>Enter your email address and we'll send you a link to reset your password.</p>

          {error && <p className="error-msg">{error}</p>}
          {message && <p className="success-msg">{message}</p>}

          <form className="forgot-password-form" onSubmit={handleSubmit}>

            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="submit-btn">Send Reset Link</button>

          </form>

          <p>
            Remember your password? <Link to="/login">Login here</Link>
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

export default ForgotPasswordPage;