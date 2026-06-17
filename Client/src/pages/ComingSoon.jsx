import { useState } from "react";
import Navbar from "../componets/Navbar.jsx";
import MentorSidebar from "../componets/Mentorsidebar.jsx";
import FresherSidebar from "../componets/FresherSidebar.jsx";

export default function ComingSoon({ title }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role;

  const navItems = [
    { icon: "🏠", label: "Dashboard", active: false },
    { icon: "👤", label: "Profile", active: false },
    { icon: "📋", label: "My Request", active: false },
    { icon: "💬", label: "Connect", active: false },
    {
      icon: role === "professional" ? "📝" : "💡",
      label: role === "professional" ? "Review Center" : "Advice",
      active: true,
    },
  ];

  const handleNotify = () => {
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#0d1117", fontFamily: "'Segoe UI', sans-serif" }}
    >
      {/* Navbar */}
      <Navbar
        homePath={
          role === "professional"
            ? "/mentor/Dashboard"
            : "/dashboard"
        }
      />
      {/* Body */}
      <div className="flex flex-1">
          {role === "professional"
    ? <MentorSidebar />
    : <FresherSidebar />}

        {/* Main */}
        <main
          className="flex-1 flex items-center justify-center p-8"
          style={{ backgroundColor: "#111827" }}
        >
          <div className="flex flex-col items-center text-center max-w-lg w-full">

            {/* Animated Icon */}
            <div
              className="relative mb-8"
              style={{ width: 96, height: 96 }}
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  backgroundColor: "#5b4fcf22",
                  animation: "ping 2s cubic-bezier(0,0,0.2,1) infinite",
                }}
              />
              <div
                className="relative w-full h-full rounded-full flex items-center justify-center text-4xl"
                style={{ backgroundColor: "#1e2a3a", border: "2px solid #5b4fcf44" }}
              >
                🚀
              </div>
            </div>

            {/* Badge */}
            <span
              className="text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
              style={{
                backgroundColor: "#2d1f6e",
                color: "#a78bfa",
                border: "1px solid #5b4fcf44",
              }}
            >
              Coming Soon
            </span>

            {/* Heading */}
            <h1
              className="font-black text-4xl mb-4 leading-tight"
              style={{ color: "#ffffff" }}
            >
              {title}
              <span style={{ color: "#a78bfa" }}> Coming Soon</span>
            </h1>

            {/* Subtext */}
            <p
              className="text-sm mb-10 leading-relaxed"
              style={{ color: "#8a9ab5" }}
            >
              {role === "professional"
                ? "We are building a powerful Review Center where mentors can review profiles, resumes, and provide feedback."
                : "We are building an Advice Center where freshers can receive career guidance, interview tips, and improvement suggestions."}
            </p>
            {/* Progress */}
            <div className="w-full mb-10">
              <div className="flex justify-between text-xs mb-2" style={{ color: "#8a9ab5" }}>
                <span>Development Progress</span>
                <span style={{ color: "#a78bfa" }}>68%</span>
              </div>
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: "#1e2a3a" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: "68%",
                    background: "linear-gradient(90deg, #5b4fcf, #a78bfa)",
                  }}
                />
              </div>
            </div>

            {/* What's coming cards */}
            <div className="grid grid-cols-3 gap-3 w-full mb-10">
              {(
                role === "professional"
                  ? [
                    { icon: "📄", label: "Resume Review" },
                    { icon: "⭐", label: "Feedback" },
                    { icon: "📊", label: "Review Analytics" },
                  ]
                  : [
                    { icon: "💡", label: "Career Advice" },
                    { icon: "🎯", label: "Interview Tips" },
                    { icon: "📚", label: "Learning Path" },
                  ]
              ).map((f) => (
                <div
                  key={f.label}
                  className="rounded-xl py-4 px-3 flex flex-col items-center gap-2"
                  style={{
                    backgroundColor: "#1e2a3a",
                    border: "1px solid #2a3a50",
                  }}
                >
                  <span className="text-2xl">{f.icon}</span>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "#8a9ab5" }}
                  >
                    {f.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Notify input */}
            {!submitted ? (
              <div className="flex w-full gap-3">
                <input
                  type="email"
                  placeholder="Enter your email for early access..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleNotify()}
                  className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                  style={{
                    backgroundColor: "#1e2a3a",
                    border: "1px solid #2a3a50",
                    color: "#e2e8f0",
                  }}
                />
                <button
                  onClick={handleNotify}
                  className="px-6 py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#5b4fcf", whiteSpace: "nowrap" }}
                >
                  Notify Me
                </button>
              </div>
            ) : (
              <div
                className="w-full py-3 rounded-xl text-sm font-semibold text-center"
                style={{
                  backgroundColor: "#0f2d1a",
                  border: "1px solid #166534",
                  color: "#4ade80",
                }}
              >
                ✅ You're on the list! We'll notify you when it's ready.
              </div>
            )}

            <p className="text-xs mt-4" style={{ color: "#4b5563" }}>
              No spam, ever. Unsubscribe anytime.
            </p>
          </div>
        </main>
      </div>

      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
    </div>
  );
}