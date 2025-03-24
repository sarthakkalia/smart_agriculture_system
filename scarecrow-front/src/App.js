// App.js
import React, { useState ,useEffect} from "react";
import {
  FiDroplet,
  FiSun,
  FiCloudRain,
  FiThermometer,
  FiZap,
  FiUser,     
  FiMail,     
  FiLock      
} from "react-icons/fi";
import DiseaseDetection from "./DiseaseDetection";
import "./App.css";
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider 
} from 'firebase/auth';
import Marketplace from "./Marketplace";


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
  const [authForm, setAuthForm] = useState({ email: "", password: "", name: "" });
  const [authError, setAuthError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showMarketplace, setShowMarketplace] = useState(false);

  
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
  };

  // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig);
  const auth = getAuth(firebaseApp);

  const handleAuthChange = (e) => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user);
      setIsLoggedIn(!!user);
      if (user) {
        localStorage.setItem('farmUser', JSON.stringify(user));
      } else {
        localStorage.removeItem('farmUser');
        setShowMarketplace(false);
        setShowDiseaseDetection(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError("");

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(
          auth,
          authForm.email,
          authForm.password
        );
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          authForm.email,
          authForm.password
        );
        await updateProfile(userCredential.user, {
          displayName: authForm.name
        });
      }
      setShowAuth(false);
      setAuthForm({ email: "", password: "", name: "" });
    } catch (error) {
      // Handle errors
      let message = error.message;
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'Email is already registered';
          break;
        case 'auth/invalid-email':
          message = 'Invalid email address';
          break;
        case 'auth/weak-password':
          message = 'Password must be at least 6 characters';
          break;
        case 'auth/user-not-found':
          message = 'No account found with this email';
          break;
        case 'auth/wrong-password':
          message = 'Incorrect password';
          break;
        default:
          message = message.replace('Firebase: ', '');
      }
      setAuthError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log('Google Sign-In Success:', result.user);
      setShowAuth(false);
      setAuthError("");
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      let message = error.message;
      if (error.code === 'auth/popup-closed-by-user') {
        message = 'Sign-in popup was closed before completing.';
      } else {
        message = message.replace('Firebase: ', '');
      }
      setAuthError(message);
    }
  };


  const handleLogout = async () => {
    try {
      await auth.signOut();  // Add this Firebase signout
      localStorage.removeItem("farmUser");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  
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
                className={`nav-item ${!showDiseaseDetection && !showMarketplace ? "active" : ""}`}
                onClick={() => {
                  setShowDiseaseDetection(false);
                  setShowMarketplace(false);
                }}
              >
                <span className="nav-icon">🌾</span>
                Crop Prediction
              </button>
              <button
                className={`nav-item ${showDiseaseDetection ? "active" : ""}`}
                onClick={() => {
                  setShowDiseaseDetection(true);
                  setShowMarketplace(false);
                }}
              >
                <span className="nav-icon">🌿</span>
                Disease Detection
              </button>
              {isLoggedIn && (
                <button
                  className={`nav-item ${showMarketplace ? "active" : ""}`}
                  onClick={() => {
                    setShowMarketplace(true);
                    setShowDiseaseDetection(false);
                  }}
                >
                  <span className="nav-icon">🛒</span>
                  Marketplace
                </button>
              )}
            </div>
          <div className="nav-actions">
            {isLoggedIn ? (
              <button className="nav-button" onClick={handleLogout}>
                <span className="button-icon">👋</span>
                Logout
              </button>
            ) : (
              <button 
                className="nav-button"
                onClick={() => {
                  setShowAuth(true);
                  setIsLogin(true);
                }}
              >
                <span className="button-icon">👨🌾</span>
                Farmer Login
              </button>
            )}
          </div>
        </div>
      </nav>
      {showAuth ? (
        <div className="main-content">
          <div className="auth-container glass">
            <h2 className="gradient-text">
              {isLogin ? 'Farmer Login' : 'Create Account'}
            </h2>
            <form onSubmit={handleAuthSubmit}>
              <div className="auth-provider-buttons">
                <button 
                  type="button" 
                  className="google-btn"
                  onClick={handleGoogleSignIn}
                >
                  <img 
                    src="https://img.icons8.com/color/48/000000/google-logo.png" 
                    alt="Google" 
                    className="provider-icon"
                  />
                  Continue with Google
                </button>
              </div>

              <div className="auth-separator">
                <span className="separator-line"></span>
                <span className="separator-text">or use email</span>
                <span className="separator-line"></span>
              </div>

              {!isLogin && (
                <div className="input-group">
                  <label>
                    <FiUser /> Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="neon-input"
                    value={authForm.name}
                    onChange={handleAuthChange}
                  />
                </div>
              )}
              
              <div className="input-group">
                <label>
                  <FiMail /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="neon-input"
                  value={authForm.email}
                  onChange={handleAuthChange}
                />
              </div>

              <div className="input-group">
                <label>
                  <FiLock /> Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  className="neon-input"
                  value={authForm.password}
                  onChange={handleAuthChange}
                />
              </div>

              {authError && <p className="error-message">{authError}</p>}

              <div className="button-group">
                <button type="submit" className="predict-btn" disabled={isLoading}>
                  {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                </button>
                <div className="secondary-buttons">
                  <button
                    type="button"
                    className="predict-btn"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setAuthError("");
                    }}
                  >
                    <span className="button-icon">🔄</span>
                    Switch to {isLogin ? 'Sign Up' : 'Login'}
                  </button>
                  <button
                    type="button"
                    className="predict-btn"
                    onClick={() => {
                      setShowAuth(false);
                      setAuthForm({ email: "", password: "", name: "" });
                      setAuthError("");
                    }}
                  >
                    <span className="button-icon">🏠</span>
                    Back to Home
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : showMarketplace ? (
        <Marketplace goBack={() => setShowMarketplace(false)} />
      ) : !showDiseaseDetection ? (
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