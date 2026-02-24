import { useState } from "react";
import ResultCard from "./ResultCard";
import landingLogo from "../LandingDoctor.png";

export default function ClinicalForm() {
  const [note, setNote] = useState("");
  const [result, setResult] = useState(null);
  const [benchmark, setBenchmark] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!note) return alert("Please enter a clinical note");

    setLoading(true);

    console.log("Submitting note:", note); // ✅ log input

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      });

      console.log("Response received:", response); // ✅ log raw response

      if (!response.ok) {
        console.error("HTTP error:", response.status, response.statusText);
        alert(`Server returned error: ${response.status} ${response.statusText}`);
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log("Data parsed:", data); // ✅ log parsed JSON

      if (!data.clinical_output || !data.benchmark) {
        console.warn("Response missing expected fields:", data);
        alert("Unexpected server response structure");
      } else {
        setResult(data.clinical_output);
        setBenchmark(data.benchmark);
        setNote("");
      }
    } catch (err) {
      console.error("Fetch or parsing error:", err); // ✅ log any network/JSON errors
      alert("Failed to analyze note. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", width: "100%", padding: "20px 10px", gap: "20px", fontFamily: "'Inter', sans-serif" }}>
      {/* Left Side */}
      <div style={{ flex: "1 1 0", paddingLeft: "0px" }}>
        <h1 style={{ fontWeight: "bold", fontSize: "26px", marginBottom: "10px", background: "linear-gradient(90deg, #30A5CB, #053177, #6D37B7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "inline-block" }}>
          Offline Clinical App
        </h1>

        <p style={{ fontSize: "16px", marginBottom: "20px", color: "#333" }}>
          Daktarite helps doctors analyze clinical notes offline with AI-powered insights. Enter your note below and get instant feedback.
        </p>

        {/* Textarea + Analyze button */}
        <div style={{ display: "flex", width: "100%", marginBottom: "20px" }}>
          <textarea
            rows={6}
            style={{ flex: 1, padding: "10px", fontSize: "14px", borderTopLeftRadius: "8px", borderBottomLeftRadius: "8px", border: "1px solid #ccc", borderRight: "none", resize: "vertical" }}
            placeholder="Enter clinical note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: "0 20px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              border: "1px solid #ccc",
              borderLeft: "none",
              borderTopRightRadius: "8px",
              borderBottomRightRadius: "8px",
              color: "#fff",
              background: "linear-gradient(90deg, #00B4D8, #7B2CBF)",
              boxShadow: "0 4px 15px rgba(123, 44, 191, 0.4)",
              transition: "all 0.3s ease",
              backgroundSize: "200% 200%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {/* Result Card */}
        {result && benchmark != null && (
          <div style={{ marginTop: "20px" }}>
            <ResultCard data={result} benchmark={benchmark} />
          </div>
        )}
      </div>

      {/* Right Side */}
      <div style={{ flex: "1 1 0", display: "flex", justifyContent: "flex-end", alignItems: "center", paddingRight: "0px" }}>
        <img
          src={landingLogo}
          alt="Daktarite Logo"
          style={{ width: "70%", maxWidth: "700px", height: "auto", objectFit: "contain", transition: "transform 0.4s ease" }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
        />
      </div>
    </div>
  );
}