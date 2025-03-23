// App.js
import React, { useState } from "react";
import {
  FiDroplet,
  FiSun,
  FiCloudRain,
  FiThermometer,
  FiZap,
} from "react-icons/fi";
import DiseaseDetection from "./DiseaseDetection";
import "./App.css";

const App = () => {
  const [formData, setFormData] = useState({
    N: "",
    P: "",
    K: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [showDiseaseDetection, setShowDiseaseDetection] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:8000/predict_crop/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.result) {
        setPrediction(data.result);
        setError(null);
      } else {
        setError(data.error);
        setPrediction(null);
      }
    } catch (err) {
      setError("Error fetching data!");
      setPrediction(null);
    }
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <span className="logo-gradient">🌱 CropWise</span>
          </div>
          <div className="nav-menu">
            <button
              className={`nav-item ${!showDiseaseDetection ? "active" : ""}`}
              onClick={() => setShowDiseaseDetection(false)}
            >
              <span className="nav-icon">🌾</span>
              Crop Prediction
            </button>
            <button
              className={`nav-item ${showDiseaseDetection ? "active" : ""}`}
              onClick={() => setShowDiseaseDetection(true)}
            >
              <span className="nav-icon">🌿</span>
              Disease Detection
            </button>
          </div>
          <div className="nav-actions">
            <button className="nav-button">
              <span className="button-icon">👨🌾</span>
              Farmer Login
            </button>
          </div>
        </div>
      </nav>

      {!showDiseaseDetection ? (
        <div className="main-content">
          <section className="hero">
            <div className="hero-content">
              <h1 className="hero-title">
                <span className="gradient-text">Smart Agriculture</span> Revolution
              </h1>
              <p className="hero-subtitle">
                AI-powered crop recommendations for optimal yield
              </p>
            </div>
            <div className="hero-blur"></div>
          </section>

          <section className="prediction-section">
            <div className="section-header">
              <h2>Crop Prediction Matrix</h2>
              <p>Enter environmental parameters to get AI recommendations</p>
            </div>

            <div className="prediction-grid">
              <div className="input-card glass">
                {Object.keys(formData).map((key) => (
                  <div className="input-group" key={key}>
                    <label>
                      {key === "ph" ? (
                        <FiDroplet />
                      ) : key === "temperature" ? (
                        <FiThermometer />
                      ) : key === "rainfall" ? (
                        <FiCloudRain />
                      ) : (
                        <FiSun />
                      )}
                      {key.toUpperCase()}
                    </label>
                    <input
                      type="number"
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      className="neon-input"
                    />
                  </div>
                ))}
                <div className="button-group">
                  <button className="predict-btn" onClick={handleSubmit}>
                    Generate Prediction <FiZap className="icon-spin" />
                  </button>
                  <button
                    className="predict-btn"
                    onClick={() => setShowDiseaseDetection(true)}
                  >
                    Switch to Disease Detection →
                  </button>
                </div>
              </div>

              <div className="result-card glass">
                {prediction ? (
                  <>
                    <h3 className="result-title">Optimal Crop</h3>
                    <div className="result-main slide-in">
                      <span className="crop-icon">🌾</span>
                      <span className="crop-name">{prediction}</span>
                    </div>
                    <button className="details-btn">
                      View Cultivation Details →
                    </button>
                  </>
                ) : (
                  <div className="result-placeholder">
                    <div className="scan-loader"></div>
                    <p>{error || "Enter parameters to get prediction"}</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      ) : (
        <DiseaseDetection goBack={() => setShowDiseaseDetection(false)} />
      )}

<footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-col">
              <h3 className="footer-title">🌾 CropWise</h3>
              <p className="footer-text">
                Empowering agriculture through AI-driven solutions for
                sustainable farming.
              </p>
              <div className="social-links">
                <a href="https://example.com/" className="social-icon">
                  🐦
                </a>
                <a href="https://example.com/" className="social-icon">
                  📘
                </a>
                <a href="https://example.com/" className="social-icon">
                  📸
                </a>
                <a href="https://example.com/" className="social-icon">
                  💼
                </a>
              </div>
            </div>

            <div className="footer-col">
              <h4 className="footer-subtitle">Quick Links</h4>
              <ul className="footer-list">
                <li>
                  <a href="#about">About Us</a>
                </li>
                <li>
                  <a href="#team">Our Team</a>
                </li>
                <li>
                  <a href="#blog">Blog</a>
                </li>
                <li>
                  <a href="#careers">Careers</a>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-subtitle">Resources</h4>
              <ul className="footer-list">
                <li>
                  <a href="#docs">Documentation</a>
                </li>
                <li>
                  <a href="#api">API Reference</a>
                </li>
                <li>
                  <a href="#help">Help Center</a>
                </li>
                <li>
                  <a href="#status">System Status</a>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-subtitle">Legal</h4>
              <ul className="footer-list">
                <li>
                  <a href="#privacy">Privacy Policy</a>
                </li>
                <li>
                  <a href="#terms">Terms of Service</a>
                </li>
                <li>
                  <a href="#cookies">Cookie Policy</a>
                </li>
                <li>
                  <a href="#security">Security</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2025 CropWise. All rights reserved.</p>
            <div className="footer-links">
              <a href="#accessibility">Accessibility</a>
              <a href="#sitemap">Sitemap</a>
              <a href="#partners">Partners</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;