import React, { useState } from "react";
import { useAnalysis } from "./hooks/useAnalysis";
import { Zap, AlertCircle, CheckCircle, FileUp, X } from "lucide-react";
import "./App.css";

export default function App() {
  const { loading, error, result, submit } = useAnalysis();
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const allowedType = "application/pdf";

  const handleFile = (selectedFile: File | null) => {
    if (!selectedFile) return;

    if (selectedFile.type !== allowedType) {
      alert("Unsupported file type. Please upload a PDF file only.");
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit(text, file);
  };

  const getRiskColor = (score: number): string => {
    if (score >= 70) return "high";
    if (score >= 40) return "medium";
    return "low";
  };

  const getRiskLabel = (score: number): string => {
    const risk = getRiskColor(score);
    return risk.charAt(0).toUpperCase() + risk.slice(1);
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <div className="header-title">
            <div className="header-icon">
              <Zap size={24} />
            </div>
            <div>
              <h1>Symptom Analysis and Risk Prediction Tool</h1>
              <p>Advanced AI-Driven Symptom Analysis and Risk Prediction</p>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <section className="form-section">
            <div className="form-container">
              <div className="form-header">
                <h2>Analyze Your Symptoms & Predict Risk</h2>
                <p>
                  Input your symptoms or upload a PDF file for evaluation
                </p>
              </div>

              <form onSubmit={handleSubmit} className="analysis-form">
                <div className="form-group">
                  <label htmlFor="text-input">Input Symptoms Here</label>
                  <textarea
                    id="text-input"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste your text here for analysis..."
                    className="textarea-input"
                    rows={6}
                  />
                  <div className="char-count">
                    {text.length} characters
                  </div>
                </div>

                <div className="divider">
                  <span>or</span>
                </div>

                <div className="form-group">
                  <label htmlFor="file-input">Upload PDF File</label>
                  <div
                    className={`file-upload-wrapper ${
                      file ? "has-file" : ""
                    } ${isDragging ? "dragging" : ""}`}
                    onClick={() =>
                      document.getElementById("file-input")?.click()
                    }
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      const droppedFile = e.dataTransfer.files[0];
                      handleFile(droppedFile);
                    }}
                  >
                    <input
                      id="file-input"
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={(e) =>
                        handleFile(e.target.files?.[0] ?? null)
                      }
                      style={{ display: "none" }}
                    />

                    <div className="file-upload-display">
                      <FileUp size={24} />
                      <span>
                        {file
                          ? file.name
                          : isDragging
                          ? "Release to upload your PDF"
                          : "Click or drag a PDF file here"}
                      </span>
                    </div>
                  </div>

                  {file && (
                    <div style={{ marginTop: "10px" }}>
                      <button
                        type="button"
                        className="remove-file"
                        onClick={() => setFile(null)}
                      >
                        <X size={16} /> Remove PDF
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || (!text && !file)}
                  className={`submit-button ${loading ? "loading" : ""}`}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap size={16} />
                      Analyze Now
                    </>
                  )}
                </button>
              </form>
            </div>
          </section>

          {error && (
            <div className="error-alert">
              <AlertCircle size={20} />
              <div className="alert-content">
                <h3>Analysis Error</h3>
                <p>{error}</p>
              </div>
            </div>
          )}

          {result && (
            <section className="results-section">
              <div className="results-header">
                <CheckCircle size={24} className="success-icon" />
                <h2>Analysis Results</h2>
              </div>

              <div className="metrics-grid">
                <div className="metric-card alignment">
                  <div className="metric-label">Alignment Score</div>
                  <div className="metric-value">
                    {result.alignment}%
                  </div>
                  <div className="metric-bar">
                    <div
                      className="metric-fill"
                      style={{ width: `${result.alignment}%` }}
                    ></div>
                  </div>
                </div>

                <div className={`metric-card risk-${getRiskColor(result.risk_score)}`}>
                  <div className="metric-label">Risk Score</div>
                  <div className="metric-value">{result.risk_score}</div>
                  <div className="metric-badge">
                    {getRiskLabel(result.risk_score)} Risk
                  </div>
                </div>

                <div className={`metric-card risk-${getRiskColor(result.severity_score)}`}>
                  <div className="metric-label">Severity Score</div>
                  <div className="metric-value">{result.severity_score}</div>
                  <div className="metric-badge">
                    {getRiskLabel(result.severity_score)} Severity
                  </div>
                </div>

                <div className={`metric-card risk-${getRiskColor(result.contradiction_score)}`}>
                  <div className="metric-label">Contradiction Score</div>
                  <div className="metric-value">{result.contradiction_score}</div>
                  <div className="metric-badge">
                    {getRiskLabel(result.contradiction_score)} Contradiction
                  </div>
                </div>
              </div>

              <div className="explanation-card">
                <h3>Detailed Explanation</h3>
                <p>{result.explanation}</p>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}