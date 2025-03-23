import React, { useState } from "react";
import { FiArrowLeft, FiUpload, FiImage, FiCheckCircle, FiMessageCircle, FiX } from "react-icons/fi";
import "./DiseaseDetection.css";

const DiseaseDetection = ({ goBack }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDragover, setIsDragover] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatResponse, setChatResponse] = useState("");
  const [userQuestion, setUserQuestion] = useState("");

  console.log(setIsDragover); // Temporary usage to bypass the warning
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
      setError("");
    } else {
      setError("Invalid file type. Please upload an image (JPEG, PNG, WEBP).");
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError("");
    setResults(null);

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await fetch("http://localhost:8000/detect_disease/", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setResults(data); // ✅ Show chatbot icon only after this is set
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChatSubmit = async () => {
    if (!userQuestion.trim()) return;

    try {
      const response = await fetch("http://localhost:8000/ask_question/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userQuestion }),
        credentials: "include",
      });

      const data = await response.json();

      if (data.answer) {
        setChatResponse(data.answer);
      } else {
        setChatResponse("No relevant answer found. Try again.");
      }

      setUserQuestion("");
    } catch (err) {
      console.error("Chatbot API error:", err);
      setChatResponse("Error fetching response. Please try again.");
    }
  };

  return (
    <div className="container">
      <button onClick={goBack} className="back-button">
        <FiArrowLeft /> Back to Crop Prediction
      </button>

      <div className="upload-card">
        <h1 className="title">
          <FiImage className="title-icon" /> Crop Disease Analyzer
        </h1>

        <div className={`drop-zone ${isDragover ? "dragover" : ""}`} onClick={() => document.getElementById("fileInput").click()}>
          <input type="file" id="fileInput" accept="image/*" onChange={handleImageUpload} hidden />
          <div className="drop-content">
            {preview ? (
              <>
                <FiCheckCircle className="upload-icon success" />
                <img src={preview} alt="Preview" className="preview-image" />
                <p className="file-name">{selectedImage.name}</p>
              </>
            ) : (
              <>
                <FiUpload className="upload-icon" />
                <p>Drag & drop plant image here</p>
                <p className="sub-text">or click to browse files</p>
              </>
            )}
          </div>
        </div>

        {preview && (
          <button onClick={analyzeImage} className="analyze-btn" disabled={loading}>
            {loading ? "Analyzing..." : "Analyze Image"}
          </button>
        )}

        {results && (
          <div className="results">
            <h2>Analysis Results</h2>
            <div className="result-item">
              <span className="result-label">Crop:</span>
              <span className="result-value">{results.crop}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Disease:</span>
              <span className="result-value">{results.disease}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Recommended Cure:</span>
              <span className="result-value">{results.cure}</span>
            </div>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {/* Chatbot Toggle Button - Show only if results are available */}
        {results && !showChatbot && (
          <button className="chat-toggle-btn" onClick={() => setShowChatbot(true)}>
            <FiMessageCircle size={24} />
          </button>
        )}

        {/* Chatbot UI */}
        {showChatbot && (
          <div className="chatbot-widget">
            <div className="chat-header">
              <span>💬 Chatbot</span>
              <button className="chat-close-btn" onClick={() => setShowChatbot(false)}>
                <FiX />
              </button>
            </div>
            <div className="chat-content">
              <p><strong>Bot:</strong> {chatResponse || "Ask me anything about crop diseases!"}</p>
            </div>
            <div className="chat-input">
              <input type="text" placeholder="Ask a question..." value={userQuestion} onChange={(e) => setUserQuestion(e.target.value)} />
              <button onClick={handleChatSubmit}>Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseaseDetection;
