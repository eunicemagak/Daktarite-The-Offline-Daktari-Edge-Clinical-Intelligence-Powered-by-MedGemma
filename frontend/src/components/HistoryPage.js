import { useEffect, useState } from "react";
import ResultCard from "./ResultCard";
import searchIcon from "../search.png";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  // Fetch history
  useEffect(() => {
    fetch("http://127.0.0.1:8000/history") // Matches backend
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(err => console.error("Failed to fetch history:", err));
  }, []);

  // Urgency statistics
  const urgencyStats = {
    high: history.filter(h => h.clinical_output?.urgency_level === "high").length,
    medium: history.filter(h => h.clinical_output?.urgency_level === "medium").length,
    low: history.filter(h => h.clinical_output?.urgency_level === "low").length
  };

  const getColor = (urgency) => {
    switch (urgency) {
      case "high": return "#ef4444";
      case "medium": return "#f59e0b";
      case "low": return "#22c55e";
      default: return "#ccc";
    }
  };

  const openModal = (entry) => {
    setSelectedEntry(entry);
    setModalOpen(true);
  };

  // Filtered history
  const filtered = history
    .filter(entry => entry.note.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(entry => urgencyFilter === "all" ? true : entry.clinical_output?.urgency_level === urgencyFilter)
    .filter(entry => {
      if (timeFilter === "all") return true;
      if (!entry.updated_at) return false;
      const now = Date.now();
      const updatedTime = new Date(entry.updated_at).getTime();
      if (timeFilter === "24h") return now - updatedTime <= 24 * 60 * 60 * 1000;
      if (timeFilter === "7d") return now - updatedTime <= 7 * 24 * 60 * 60 * 1000;
      return true;
    });

  return (
    <div style={{ padding: 20, fontFamily: "'Inter', sans-serif" }}>
      {/* Title + Filters */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <h1 style={{ color: "#6b7280", fontWeight: "bold", fontSize: 18, margin: 0 }}>
          Clinical History
        </h1>
        <div style={{ display: "flex", gap: 8 }}>
          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid #ccc",
              backgroundColor: "#f3f4f6",
              cursor: "pointer",
              fontWeight: 500,
              fontSize: 14,
            }}
          >
            <option value="all">All Urgency</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid #ccc",
              backgroundColor: "#f3f4f6",
              cursor: "pointer",
              fontWeight: 500,
              fontSize: 14,
            }}
          >
            <option value="all">All Time</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
        </div>
      </div>

      {/* Search Input */}
      <div style={{ display: "flex", marginTop: 10 }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            backgroundColor: "#e5e7eb",
            padding: "8px 12px",
            borderRadius: 6,
            gap: 8,
            cursor: "text"
          }}
          onClick={() => document.getElementById("searchInput").focus()}
        >
          <img src={searchIcon} alt="Search" style={{ width: 18, height: 18 }} />
          <input
            id="searchInput"
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 13,
            }}
          />
        </div>
      </div>

      {/* Urgency Stats */}
      <div style={{ display: "flex", gap: 12, marginTop: 15 }}>
        <div style={{ background: "#ef4444", color: "white", padding: 12, borderRadius: 8 }}>
          High: {urgencyStats.high}
        </div>
        <div style={{ background: "#f59e0b", color: "white", padding: 12, borderRadius: 8 }}>
          Medium: {urgencyStats.medium}
        </div>
        <div style={{ background: "#22c55e", color: "white", padding: 12, borderRadius: 8 }}>
          Low: {urgencyStats.low}
        </div>
      </div>

      {/* Notes Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 15,
        marginTop: 20
      }}>
        {filtered.map((entry, index) => (
          <div
            key={index}
            style={{
              position: "relative",
              backgroundColor: getColor(entry.clinical_output?.urgency_level),
              color: "white",
              padding: 12,
              borderRadius: 10,
              display: "flex",
              flexDirection: "column",
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              transition: "transform 0.2s",
              fontSize: "12px",
              maxHeight: "180px",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            onClick={() => openModal(entry)}
          >
            <div style={{ overflowY: "auto", paddingBottom: "28px", wordBreak: "break-word", flex: 1 }}>
              {entry.note}
            </div>
            <div style={{ textAlign: "right", fontWeight: "bold", marginTop: 8 }}>
              {entry.clinical_output?.urgency_level?.toUpperCase()}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(entry.note);
                alert("Copied!");
              }}
              style={{
                position: "absolute",
                bottom: 8,
                left: 8,
                background: "rgba(255, 255, 255, 0.2)",
                color: "#fff",
                border: "1px solid #fff",
                borderRadius: "4px",
                padding: "2px 6px",
                fontSize: "10px",
                cursor: "pointer",
                backdropFilter: "blur(2px)",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.4)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
            >
              Copy
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && selectedEntry && (
        <div
          onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}
        >
          <div style={{ position: "relative", width: "90%", maxWidth: 600 }}>
            <button
              onClick={() => setModalOpen(false)}
              style={{
                position: "absolute",
                top: -10,
                right: -10,
                background: "#ef4444",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: 30,
                height: 30,
                fontSize: 16,
                cursor: "pointer",
                zIndex: 1001,
              }}
            >
              ✕
            </button>

            <ResultCard data={selectedEntry.clinical_output} benchmark={selectedEntry.benchmark} />
          </div>
        </div>
      )}
    </div>
  );
}