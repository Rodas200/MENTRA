import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../componets/Navbar.jsx";



const statusStyle = (status) => {
  switch (status) {
    case "Referred":
      return { backgroundColor: "#0d2e22", color: "#2ecc71", border: "1px solid #2ecc71" };
    case "Needs Improvement":
      return { backgroundColor: "#3a0e1e", color: "#e74c6f", border: "1px solid #e74c6f" };
    default:
      return { backgroundColor: "transparent", color: "#8a9ab5", border: "1px solid #2e3a4e" };
  }
};

const navItems = [
  { icon: "🏠", label: "Dashboard", path: "/dashboard", active: false },
  { icon: "👤", label: "Profile", path: "/profile", active: false },
  { icon: "📋", label: "My Request", path: "/requests", active: true },
  { icon: "💬", label: "Connect", path: "/connect", active: false },
  { icon: "💡", label: "Advice", path: "/advice", active: false },
];


export default function MyRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
"https://mentra-ne9a.onrender.com/api/requests/my-sent-requests",

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRequests(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0d1117", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Navbar */}
      <Navbar homePath="/requests" />

      {/* Body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className="w-100 shrink-0 flex flex-col justify-between py-6 px-4"
          style={{ backgroundColor: "#0d1117", borderRight: "1px solid #1e2530" }}
        >
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() =>
                  navigate(item.path)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-semibold w-full text-left"
                style={
                  item.active
                    ? { backgroundColor: "#5b4fcf", color: "#fff" }
                    : { color: "#8a9ab5" }
                }
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <button
            className="w-full py-3 rounded-xl text-sm font-semibold text-white"
            style={{ backgroundColor: "#1e293b" }}
          >
            Switch to <strong>Mentor</strong>
          </button>
        </aside>
        {/* Main */}
        <main className="flex-1 p-8" style={{ backgroundColor: "#111827" }}>
          <h1 className="text-white font-black text-4xl mb-6" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
            My Requests
          </h1>

          {/* Table */}
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#161c27", border: "1px solid #1e2a3a" }}>
            {/* Table Header */}
            <div
              className="grid px-6 py-4"
              style={{
                gridTemplateColumns: "2fr 1.5fr 1.2fr 1fr",
                borderBottom: "1px solid #1e2a3a",
                backgroundColor: "#0f172a",
              }}
            >
              {["TITLE", "STATUS", "DATE", "ACTION"].map((col) => (
                <span key={col} className="text-xs font-bold tracking-widest" style={{ color: "#8a9ab5" }}>
                  {col}
                </span>
              ))}
            </div>

            {/* Rows */}
            {requests.map((req) => (
              <div
                key={req._id}
                className="grid items-center px-6 py-5"
                style={{

                  gridTemplateColumns: "2fr 1.5fr 1.2fr 1fr",
                  borderBottom: "1px solid #2c394c",
                  backgroundColor: "#1e293b",
                }}
              >
                <span className="text-white font-bold text-sm">{req.desiredRole}</span>

                <span>
                  <span
                    className="text-xs font-semibold px-3 py-1.5 rounded-md"
                    style={statusStyle(req.status)

                    }

                  >
                    {req.status}
                  </span>
                </span>

                <span className="text-sm" style={{ color: "#8a9ab5" }}>{new Date(req.createdAt).toLocaleDateString()}</span>

                <span>
                  <button
                    className="text-sm font-bold"
                    style={{ color: "#7b6ff0" }}
                    onClick={() => setSelectedRequest(req)}
                      >
                    View Details
                  </button>
                </span>
              </div>
            ))}
          </div>
        </main>
      </div>

      {selectedRequest && (
  <div
    className="fixed inset-0 flex items-center justify-center z-50"
    style={{
      backgroundColor: "rgba(0,0,0,0.7)",
    }}
  >
    <div
      className="rounded-3xl p-8 w-full max-w-lg"
      style={{
        backgroundColor: "#17233a",
        border: "1px solid #2e3a4e",
      }}
    >
      <h2
        className="text-3xl font-bold mb-6 text-center text-white"
      >
        📋 Referral Request Details
      </h2>

      <div className="space-y-4 text-white">
        <p>
          <strong>Mentor:</strong>{" "}
          {selectedRequest.mentor?.name}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {selectedRequest.status}
        </p>

        <p>
          <strong>Message:</strong>{" "}
          {selectedRequest.message}
        </p>

        <p>
          <strong>Date:</strong>{" "}
          {new Date(
            selectedRequest.createdAt
          ).toLocaleDateString()}
        </p>
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={() => setSelectedRequest(null)}
          className="px-8 py-3 rounded-xl font-bold text-white"
          style={{
            backgroundColor: "#5b4fcf",
          }}
        >
          OK
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}