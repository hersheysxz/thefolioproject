// frontend/src/pages/SplashPage.js

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../assets/logo.PNG";

function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home", { replace: true });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-page">
      <div className="splash-shell">
        <div className="splash-brand-panel">
          <img src={logo} alt="Almost Real logo" className="logo-img" />
          <div className="splash-brand-copy">
            <h1>ALMOST REAL</h1>
          </div>
          <div className="splash-loading-minimal">
            <div className="spinner"></div>
            <span>Loading</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SplashPage;
