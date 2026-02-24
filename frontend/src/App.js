import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import ClinicalForm from "./components/ClinicalForm";
import HistoryPage from "./components/HistoryPage";
import logo from "./daktarite-logo.png";

function Header() {
  const location = useLocation();

  const linkStyle = {
    textDecoration: "none",
    fontWeight: 600,
    color: "#000",
    position: "relative",
    paddingBottom: "10px",
    transition: "all 0.3s ease",
    fontSize: "16px",
  };

  const underlineStyle = (active) => ({
    position: "absolute",
    left: 0,
    bottom: "-6px",
    width: active ? "100%" : "0%",
    height: "3px",
    background: "linear-gradient(90deg, #00B4D8, #7B2CBF)",
    transition: "width 0.3s ease",
    borderRadius: "2px",
  });

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: "rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        padding: "15px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center", // Centers nav
      }}
    >
      {/* Logo positioned left */}
      <div
        style={{
          position: "absolute",
          left: "40px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          src={logo}
          alt="Daktarite Logo"
          style={{ height: "40px", width: "auto",}}
        />
      </div>

      {/* Centered Navigation */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "50px",
        }}
      >
        <Link to="/" style={linkStyle}>
          <span
            style={{ position: "relative" }}
            onMouseEnter={(e) =>
              (e.currentTarget.lastChild.style.width = "100%")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.lastChild.style.width =
                location.pathname === "/" ? "100%" : "0%")
            }
          >
            Analyze
            <span style={underlineStyle(location.pathname === "/")} />
          </span>
        </Link>

        <Link to="/history" style={linkStyle}>
          <span
            style={{ position: "relative" }}
            onMouseEnter={(e) =>
              (e.currentTarget.lastChild.style.width = "100%")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.lastChild.style.width =
                location.pathname === "/history" ? "100%" : "0%")
            }
          >
            History
            <span style={underlineStyle(location.pathname === "/history")} />
          </span>
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Header />
      <div style={{ padding: 40 }}>
        <Routes>
          <Route path="/" element={<ClinicalForm />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
