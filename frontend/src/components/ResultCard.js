import { useState } from "react";
import { jsPDF } from "jspdf";
import UrgencyBadge from "./UrgencyBadge";

export default function ResultCard({ data, benchmark, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [summary, setSummary] = useState(data.summary || "");

  if (!data) return null;

  const exportPDF = () => {
    const doc = new jsPDF();
    let y = 10;

    doc.setFontSize(16);
    doc.text("Clinical AI Report", 10, y);
    y += 10;

    doc.setFontSize(12);
    if (data.patient_name) {
      doc.text(`Patient Name: ${data.patient_name}`, 10, y);
      y += 10;
    }

    doc.text(`Summary: ${summary}`, 10, y);
    y += 10;
    doc.text(`Urgency Level: ${data.urgency_level}`, 10, y);
    y += 10;

    if (data.symptoms?.length > 0) {
      doc.text("Symptoms:", 10, y);
      y += 8;
      data.symptoms.forEach((s) => {
        doc.text(`- ${s}`, 15, y);
        y += 8;
      });
      y += 5;
    }

    if (data.red_flags?.length > 0) {
      doc.text("Red Flags:", 10, y);
      y += 8;
      data.red_flags.forEach((r) => {
        doc.text(`- ${r}`, 15, y);
        y += 8;
      });
      y += 5;
    }

    if (data.medications?.length > 0) {
      doc.text("Medications:", 10, y);
      y += 8;
      data.medications.forEach((m) => {
        const medText =
          typeof m === "string" ? m : `${m.name}${m.dosage ? ` - ${m.dosage}` : ""}`;
        doc.text(`- ${medText}`, 15, y);
        y += 8;
      });
      y += 5;
    }

    if (data.allergies?.length > 0) {
      doc.text("Allergies:", 10, y);
      y += 8;
      data.allergies.forEach((a) => {
        doc.text(`- ${a}`, 15, y);
        y += 8;
      });
      y += 5;
    }

    if (benchmark) {
      doc.text(`Latency: ${benchmark.latency_seconds}s`, 10, y);
      y += 8;
      doc.text(`Memory Used: ${benchmark.memory_used_mb} MB`, 10, y);
    }

    doc.save("clinical_report.pdf");
  };

  const handleApprove = () => {
    alert("Note approved!");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      onDelete && onDelete(data);
    }
  };

  const listItemStyle = { fontSize: "13px", color: "#6B7280", marginTop: 2 };

  return (
    <div
      style={{
        marginTop: "20px",
        padding: "20px",
        backgroundColor: "#f8f9fa",
        color: "#1e1e2f",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      {data.patient_name && <h3>Patient: {data.patient_name}</h3>}

      <h2
        style={{
          fontSize: "16px",
          color: "#565a63",
          marginBottom: "8px",
        }}
      >
        Clinical Summary
      </h2>

      {editing ? (
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={6}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "14px",
            color: "#4B5563",
            borderRadius: "6px",
            border: "1px solid #ccc",
            backgroundColor: "#f9fafb",
          }}
        />
      ) : (
        <p style={{ whiteSpace: "pre-wrap", fontSize: "14px", color: "#6B7280", lineHeight: 1.5 }}>
          {expanded || summary.length <= 200 ? summary : summary.substring(0, 200)}
          {summary.length > 200 && !expanded && (
            <>
              ...{" "}
              <span
                style={{ color: "#3B82F6", cursor: "pointer" }}
                onClick={() => setExpanded(true)}
              >
                See All
              </span>
            </>
          )}
        </p>
      )}

      <UrgencyBadge level={data.urgency_level} />

      {data.symptoms?.length > 0 && (
        <div style={{ marginTop: 15 }}>
          <strong>Symptoms:</strong>
          <ul style={listItemStyle}>
            {data.symptoms.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {data.red_flags?.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <strong>Red Flags:</strong>
          <ul style={listItemStyle}>
            {data.red_flags.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {data.medications?.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <strong>Medications:</strong>
          <ul style={listItemStyle}>
            {data.medications.map((m, i) => (
              <li key={i}>
                {typeof m === "string" ? m : `${m.name}${m.dosage ? ` - ${m.dosage}` : ""}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.allergies?.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <strong>Allergies:</strong>
          <ul style={listItemStyle}>
            {data.allergies.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      )}

      {benchmark && (
        <div style={{ fontSize: "12px", color: "#555", marginTop: "10px" }}>
          Latency: {benchmark.latency_seconds}s | Memory Used: {benchmark.memory_used_mb} MB
        </div>
      )}

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          gap: "10px",
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={() => setEditing(!editing)}
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            backgroundColor: editing ? "#FACC15" : "#FBBF24",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
          }}
        >
          {editing ? "Save" : "Edit"}
        </button>

        <button
          onClick={handleApprove}
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            backgroundColor: "#3B82F6",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
          }}
        >
          Approve
        </button>

        <button
          onClick={exportPDF}
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            backgroundColor: "#22C55E",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
          }}
        >
          Export PDF
        </button>

        <button
          onClick={handleDelete}
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            backgroundColor: "#EF4444",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
