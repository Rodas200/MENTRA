import Navbar from "../componets/Navbar.jsx";
import MentorSidebar from "../componets/Mentorsidebar.jsx";
import { useState, useEffect } from "react";
import axios from "axios";


function DonutChart({
  pending,
  referred,
  needsImprovement,
}) {
  console.log("CHART DATA =", {
    pending,
    referred,
    needsImprovement,
  });

  const cx = 150;
  const cy = 150;
  const R = 130;
  const r = 90;

  const total = pending + referred + needsImprovement;
  const referredAngle = (referred / total) * 360;
  const needsAngle = (needsImprovement / total) * 360;
  const pendingAngle = (pending / total) * 360;

  const toRad = (deg) => (deg * Math.PI) / 180;

  const arc = (startDeg, endDeg, color) => {
    const x1 = cx + R * Math.cos(toRad(startDeg));
    const y1 = cy + R * Math.sin(toRad(startDeg));
    const x2 = cx + R * Math.cos(toRad(endDeg));
    const y2 = cy + R * Math.sin(toRad(endDeg));
    const largeArc = endDeg - startDeg > 180 ? 1 : 0;
    return (
      <path
        d={`M ${cx} ${cy} L ${x1} ${y1} A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2} Z`}
        fill={color}
      />
    );
  };

  return (
    <svg width="350" height="350" viewBox="0 0 300 300">
      {arc(-90, -90 + referredAngle, "#2ecc71")}

      {arc(
        -90 + referredAngle,
        -90 + referredAngle + needsAngle,
        "#e74c6f"
      )}

      {arc(
        -90 + referredAngle + needsAngle,
        270,
        "#3a4a5e"
      )}
      <circle cx={cx} cy={cy} r={r} fill="#1a2235" />
    </svg>
  );
}


export default function MentorDashboard() {
  const [dashboardData, setDashboardData] = useState({
    pending: 0,
    referred: 0,
    needsImprovement: 0,
    recentRequests: [],
  });

  const user = JSON.parse(localStorage.getItem("user"));
  console.log("User Data:", user);

  const fetchDashboard = async () => {
    console.log("fetchDashboard running");
    try {
      const token = localStorage.getItem("token");


      console.log("After API Call");


      const res = await axios.get(
        "https://mentra-ne9a.onrender.com/api/requests/mentor-dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("After API Call");
      console.log("Dashboard Data:", res.data);
      setDashboardData(res.data);

    } catch (error) {
      console.log("Dashboard Error:", error.response?.data);
      console.log(error);
    };

  };

  useEffect(() => {
    fetchDashboard();
  }, []);

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

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#0d1117", fontFamily: "'Segoe UI', sans-serif" }}
    >
      <Navbar homePath="/mentor/dashboard" />


      {/* Body */}
      <div className="flex flex-1">
        <MentorSidebar />


        {/* Main */}
        <main className="flex-1 p-8 overflow-y-auto" style={{ backgroundColor: "#111827" }}>
          <h1 className="text-white font-black text-4xl mb-2">
            Welcome Back,  {user?.name}!
          </h1>
          <p className="text-sm mb-8" style={{ color: "#8a9ab5" }}>
            Track the status of  referral requests and help the fresher..
          </p>


          {/* Stat Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl p-6 h-40"
                style={{ backgroundColor: s.bg, border: `1px solid ${s.border}` }}
              >
                <p
                  className="text-md font-bold tracking-widest mb-4"
                  style={{ color: s.labelColor }}
                >
                  {s.label}
                </p>
                <p className="text-5xl font-black" style={{ color: s.valueColor }}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {/* Status Distribution */}
          <div
            className="rounded-2xl p-6 mb-6"
            style={{ backgroundColor: "#1a2235", border: "1px solid #1e2a3a" }}
          >
            <h2 className="text-white font-bold text-lg mb-6">Status Distribution</h2>
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
                  <span className="text-sm" style={{ color: "#8a9ab5" }}> Request Pending</span>
                </div>
              </div>
            </div>
          </div>


          <div
            className="rounded-2xl p-6 mt-7"
            style={{ backgroundColor: "#161c27", border: "1px solid #1e2a3a" }}
          >
            <h2 className="text-white font-bold text-lg mb-5">Recent Activity</h2>
            <div className="flex flex-col gap-3">
              {dashboardData.recentRequests.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between px-5 py-4 rounded-xl"
                  style={{ backgroundColor: "#1a2235", border: "1px solid #1e2a3a" }}
                >
                  <span className="text-white font-semibold text-sm">{item.desiredRole}</span>
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
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}