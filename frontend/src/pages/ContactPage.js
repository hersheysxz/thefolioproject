import React, { useState } from "react";
import API from "../api/axios";
import "../styles/ContactPage.css";

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [subjectError, setSubjectError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let valid = true;

    if (name.trim() === "") {
      setNameError("Please enter your name");
      valid = false;
    } else {
      setNameError("");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim() === "") {
      setEmailError("Please enter your email");
      valid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      valid = false;
    } else {
      setEmailError("");
    }

    if (subject.trim() === "") {
      setSubjectError("Please enter a subject");
      valid = false;
    } else {
      setSubjectError("");
    }

    if (message.trim() === "") {
      setMessageError("Please enter your message");
      valid = false;
    } else {
      setMessageError("");
    }

    if (valid) {
      setLoading(true);
      try {
        await API.post("/messages", {
          subject,
          body: message,
        });

        setSuccessMessage("Message sent successfully. We'll get back to you soon.");
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");

        setTimeout(() => setSuccessMessage(""), 5000);
      } catch (error) {
        console.error("Failed to send message:", error);
        setMessageError("Failed to send message. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-header">
          <h1>Get in Touch</h1>
          <p>
            Send a question, collaboration idea, or message for the Almost Real
            project and we will respond as soon as possible.
          </p>
        </div>

        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="contact-main-grid">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {nameError && <span className="error">{nameError}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && <span className="error">{emailError}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <input
                type="text"
                id="subject"
                placeholder="What is this about?"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              {subjectError && <span className="error">{subjectError}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                placeholder="Please share your message, question, or feedback..."
                rows="6"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              {messageError && <span className="error">{messageError}</span>}
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>

          <div className="contact-info">
            <h3>Other Ways to Reach Us</h3>
            <div className="info-items">
              <div className="info-item">
                <span className="icon">📍</span>
                <div>
                  <h4>Visit Us</h4>
                  <p>
                    The Folio Project Studio
                    <br />
                    Location and hours vary by appointment
                  </p>
                </div>
              </div>
              <div className="info-item">
                <span className="icon">📞</span>
                <div>
                  <h4>Call Us</h4>
                  <p>Available during business hours</p>
                </div>
              </div>
              <div className="info-item">
                <span className="icon">⏰</span>
                <div>
                  <h4>Response Time</h4>
                  <p>We typically respond within 24 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="map-section">
          <h3>Our Location</h3>
          <div className="map-wrapper">
            <iframe
              title="Studio Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.8568783422847!2d120.91684347585254!3d14.607711311545638!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397ca03ac3d07e1%3A0xad2f115e854a099!2sManila%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1700000000000"
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: "8px" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen=""
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
