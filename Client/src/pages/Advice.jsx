
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../componets/Navbar.jsx";

const navItems = [
  { icon: "🏠", label: "Dashboard", path: "/dashboard", active: false},
  { icon: "👤", label: "Profile", path: "/profile", active: false },
  { icon: "📋", label: "My Request", path: "/requests", active: false },
  { icon: "💬", label: "Connect", path: "/connect", active: false },
  { icon: "💡", label: "Advice", path: "/advice", active: true},
];


const initialAdvice = [
  {
    id: 1,
    title: "Strengthen Your DSA Foundations",
    description: "Focus on arrays, hashmaps, and sliding window patterns. These are the most common in FAANG interviews.",
    by: "👤Alex Mentor",
    tag: "DSA",
  },
  {
    id: 2,
    title: "Build One Full-Stack Project",
    description: "Recruiters want to see something real. One polished project beats five half-finished ones.",
    by: "👤Sarah Senior",
    tag: "Projects",
  },
];

const TAGS = ["DSA", "Projects", "Resume", "System Design", "Networking", "Communication", "Open Source"];

export default function Advice() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };



  const [adviceList, setAdviceList] = useState(initialAdvice);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTag, setSelectedTag] = useState("DSA");

  const handlePost = () => {
    if (!title.trim() || !description.trim()) return;
    setAdviceList([
      ...adviceList,
      { id: Date.now(), title, description, by: "You", tag: selectedTag },
    ]);
    setTitle("");
    setDescription("");
    setSelectedTag("DSA");
    setShowModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0d1117", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Navbar */}
      <Navbar homePath="/advice" />

      {/* Body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-100 shrink-0 flex flex-col justify-between py-6 px-4" style={{ backgroundColor: "#0d1117", borderRight: "1px solid #1e2530" }}>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => 
                 navigate(item.path)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-semibold w-full text-left"
                style={item.active ? { backgroundColor: "#5b4fcf", color: "#fff" } : { color: "#8a9ab5" }}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
          <button className="w-full py-3 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: "#1e293b" }}>
            Switch to <strong>Mentor</strong>
          </button>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8 overflow-y-auto" style={{ backgroundColor: "#0f172a" }}>
          <h1 className="text-white font-black text-4xl mb-2">Study Advice</h1>
          <p className="text-sm mb-8" style={{ color: "#8a9ab5" }}>
            Share tips and resources to help freshers get referred faster.
            Insights,roadmap,and guidelines curated by top industry proffessionals.
          </p>

          {/* Cards Grid */}
          <div className="grid grid-cols-3 gap-4">
            {/* Advice Cards */}
            {adviceList.map((advice) => (
              <div
                key={advice.id}
                className="rounded-2xl p-6 flex flex-col gap-3 h-80"
                style={{ backgroundColor: "#161c27", border: "1px solid #1e2a3a" }}
              >
                {/* Tag */}
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full w-fit"
                  style={{ backgroundColor: "#1a1f35", color: "#7b6ff0", border: "1px solid #5b4fcf" }}
                >
                  {advice.tag}
                </span>

                <h3 className="font-bold text-base" style={{ color: "#7b6ff0" }}>
                  {advice.title}
                </h3>

                <p className="text-sm leading-relaxed" style={{ color: "#c8d3e0" }}>
                  {advice.description}
                </p>

                <p className="text-xs mt-auto pt-2" style={{ color: "#4a5568", borderTop: "1px solid #1e2a3a" }}>
                  By {advice.by}
                </p>
              </div>
            ))}


          </div>
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-lg rounded-2xl p-8" style={{ backgroundColor: "#161c27", border: "1px solid #1e2a3a" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-black text-2xl">Post New Advice</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white text-xl leading-none">✕</button>
            </div>

            <div className="flex flex-col gap-4">
              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold tracking-widest uppercase" style={{ color: "#8a9ab5" }}>Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master System Design Basics"
                  className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600"
                  style={{ backgroundColor: "#0f172a", border: "1px solid #2e3a4e" }}
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold tracking-widest uppercase" style={{ color: "#8a9ab5" }}>Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Give detailed advice to help freshers improve and get referred..."
                  className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none resize-none placeholder:text-gray-600"
                  style={{ backgroundColor: "#0f172a", border: "1px solid #2e3a4e" }}
                />
              </div>

              {/* Tag */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold tracking-widest uppercase" style={{ color: "#8a9ab5" }}>Category</label>
                <div className="flex flex-wrap gap-2">
                  {TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
                      style={
                        selectedTag === tag
                          ? { backgroundColor: "#5b4fcf", color: "#fff", border: "1px solid #5b4fcf" }
                          : { backgroundColor: "#0f172a", color: "#8a9ab5", border: "1px solid #2e3a4e" }
                      }
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold"
                  style={{ backgroundColor: "#0f172a", color: "#8a9ab5", border: "1px solid #2e3a4e" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePost}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#5b4fcf" }}
                >
                  Post Advice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

