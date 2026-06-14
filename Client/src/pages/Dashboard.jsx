import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../componets/Navbar";

// Donut chart: Referred=25%, NeedsImprovement=12.5%, Pending=62.5%
// Colors: green=#2ecc71, red=#e74c6f, dark gray=#2e3a4e
function DonutChart({ pending, referred, needsImprovement }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const R = 155;
    const r = 112;

    const segments = [
      { value: referred, color: "#2ecc71" },
      { value: needsImprovement, color: "#e74c6f" },
      { value: pending, color: "#3a4a5e" },
    ];

    const total = segments.reduce(
      (sum, seg) => sum + seg.value,
      0
    );

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (total === 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, 2 * Math.PI);
      ctx.fillStyle = "#3a4a5e";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      ctx.fillStyle = "#1a2235";
      ctx.fill();

      return;
    }

    let startAngle = -Math.PI / 2;

    for (const seg of segments) {
      const sweep =
        (seg.value / total) * 2 * Math.PI;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(
        cx,
        cy,
        R,
        startAngle,
        startAngle + sweep
      );
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();

      startAngle += sweep;
    }

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.fillStyle = "#1a2235";
    ctx.fill();

  }, [pending, referred, needsImprovement]);

  return (
    <canvas
      ref={canvasRef}
      width={420}
      height={360}
    />
  );
}

const navItems = [
  { icon: "🏠", label: "Dashboard", path: "/dashboard", active: true },
  { icon: "👤", label: "Profile", path: "/profile", active: false },
  { icon: "📋", label: "My Request", path: "/requests", active: false },
  { icon: "💬", label: "Connect", path: "/connect", active: false },
  { icon: "💡", label: "Advice", path: "/advice", active: false },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    pending: 0,
    referred: 0,
    needsImprovement: 0,
    recentRequests: [],
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const stats = [
    {
      label: "REQUESTS PENDING",
      value: dashboardData.pending,
      bg: "#1a2235",
      border: "#2e3a4e",
      valueColor: "#ffffff",
      labelColor: "#8a9ab5",
    },
    {
      label: "SUCCESSFULLY REFERRED",
      value: dashboardData.referred,
      bg: "#0d2420",
      border: "#1a4a3a",
      valueColor: "#2ecc71",
      labelColor: "#2ecc71",
    },
    {
      label: "NEEDS IMPROVEMENT",
      value: dashboardData.needsImprovement,
      bg: "#2a0e1a",
      border: "#4a1a2a",
      valueColor: "#e74c6f",
      labelColor: "#e74c6f",
    },
  ];

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/requests/dashboard",
         {
          

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Dashboard API:", res.data);


      setDashboardData(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };
  return (
    <div
      className="min-h-screen flex flex-col overflow-x-hidden"
      style={{ backgroundColor: "#0d1117", fontFamily: "'Segoe UI', sans-serif" }}
    >
      {/* Navbar */}
      <Navbar homePath="/dashboard" />

      {/* Body */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Sidebar (Desktop) */}
        <aside
          className="hidden lg:flex w-100 shrink-0 flex-col justify-between py-8 px-6"
          style={{ backgroundColor: "#0d1117", position: "sticky", borderRight: "1px solid #1e2530" }}
        >
          <div>
            {/* Avatar placeholder */}


            {/* Nav Items */}
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() =>
                    navigate(item.path)}

                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-semibold w-full text-left transition-all"
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
          </div>

          {/* Switch to Professional */}
          <button
            className="w-full py-3 rounded-xl text-sm font-semibold text-white"
            style={{ backgroundColor: "#1e293b" }}
          >
            Switch to <strong>Mentor</strong>
          </button>
        </aside>

        {/* Main */}
        <main
          className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:p-8"
          style={{ backgroundColor: "#111827" }}
        >
          {/* Heading */}
          <h1
            className="text-white font-black text-2xl sm:text-3xl lg:text-4xl mb-2"
            style={{ fontFamily: "'Segoe UI', sans-serif" }}
          >
            
          Welcome Back, {user?.name}!
          </h1>
          <p className="text-sm mb-8" style={{ color: "#8a9ab5" }}>
            Track the status of your referral requests and celebrate your wins.
          </p>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl p-6 h-40"
                style={{ backgroundColor: s.bg, border: `1px solid ${s.border}` }}
              >
                <p
                  className="text-md font-semibold tracking-widest mb-4 wrap-break-word"
                  style={{ color: s.labelColor }}
                >
                  {s.label}
                </p>
                <p className="text-4xl sm:text-5xl font-black" style={{ color: s.valueColor }}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {/* Overall Request Status (Donut) */}
          <div
            className="rounded-2xl p-6 mb-6"
            style={{ backgroundColor: "#1a2235", border: "1px solid #1e2a3a" }}
          >
            <h2 className="text-white font-bold text-lg mb-6">Overall Request Status</h2>
            <div className="flex flex-col items-center">
              <DonutChart
               pending={dashboardData.pending}
               referred={dashboardData.referred}
               needsImprovement={dashboardData.needsImprovement}
/>
              {/* Legend */}
              <div className="flex items-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-3 rounded-sm" style={{ backgroundColor: "#2ecc71" }} />
                  <span className="text-sm" style={{ color: "#8a9ab5" }}>Referred</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-3 rounded-sm" style={{ backgroundColor: "#e74c6f" }} />
                  <span className="text-sm" style={{ color: "#8a9ab5" }}>Needs Improvement</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-3 rounded-sm" style={{ backgroundColor: "#3a4a5e" }} />
                  <span className="text-sm" style={{ color: "#8a9ab5" }}>Pending</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="flex flex-col gap-3">

            {dashboardData.recentRequests.length === 0 ? (
              <p className="text-gray-400">
                No referral requests yet.
              </p>
            ) : (
              dashboardData.recentRequests.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between px-5 py-4 rounded-xl"
                  style={{
                    backgroundColor: "#172032",
                    border: "1px solid #1e2a3a",
                  }}
                >
                  <span className="text-white font-semibold text-sm">
                    {item.desiredRole}
                  </span>
                  <span
                    className="text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{
                      backgroundColor:
                        item.status === "Referred"
                          ? "#1a4a3a"
                          : item.status === "Needs Improvement"
                            ? "#3a0e1e"
                            : "transparent",

                      color:
                        item.status === "Referred"
                          ? "#2ecc71"
                          : item.status === "Needs Improvement"
                            ? "#e74c6f"
                            : "#8a9ab5",

                      border:
                        item.status === "Referred"
                          ? "1px solid #2ecc71"
                          : item.status === "Needs Improvement"
                            ? "1px solid #e74c6f"
                            : "1px solid #2e3a4e",
                    }}
                  >
                    {item.status}
                  </span>
                </div>
        )      ))}
          </div>
    </main>
      </div >
    </div >
  );
}
