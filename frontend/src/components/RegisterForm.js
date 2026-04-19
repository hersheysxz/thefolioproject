import React, { useState } from "react";
import API from "../api/axios";

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Age Verification
    if (!dob) {
      setMessage("Please select your birth date.");
      setColor("red");
      return;
    }

    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      setMessage("Access Denied: You must be 18 or older to register.");
      setColor("#ff4d4d");
      return;
    }

    // 2. Send Data to Backend
    try {
      // Use the configured API client so the request goes to the backend server
      const res = await API.post("/auth/register", { name, email, password });

      console.log("Response:", res.data);
      setMessage("Registration Successful!");
      setColor("#28a745");
      alert("Registration Successful!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration Failed.");
      setColor("red");
    }
  };

  return (
    <form id="registerForm" onSubmit={handleSubmit}>
      <h2>Register</h2>
      
      <label>Full Name:</label>
      <input 
        type="text" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        required 
      />

      <label>Email Address:</label>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        required 
      />

      <label>Password:</label>
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        required 
      />

      <label>Date of Birth:</label>
      <input
        type="date"
        id="dob"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
        required
      />

      <p id="dobError" style={{ color: color }}>
        {message}
      </p>

      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterForm;