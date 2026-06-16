import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../componets/Navbar.jsx";

// NOTE: This file was previously broken (missing variables like activeTab, sentReferrals, statusBadge, etc.).
// It is now aligned with the known-good implementation from Client/src/pages/Connect.jsx.

const navItems = [
  { icon: "🏠", label: "Dashboard", path: "/dashboard", active: false },
  { icon: "👤", label: "Profile", path: "/profile", active: false },
  { icon: "📋", label: "My Request", path: "/requests", active: false },
  { icon: "💬", label: "Connect", path: "/connect", active: true },
  { icon: "💡", label: "Advice", path: "/advice", active: false },
];

export default function ConnectMentor() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const [activeTab, setActiveTab] = useState("discover");
  const [sentRequests, setSentRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterReferral, setFilterReferral] = useState(false);

  const [requestModal, setRequestModal] = useState(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [connectedIds, setConnectedIds] = useState([]);
  const [requestedIds, setRequestedIds] = useState([]);
  const [jobRole, setJobRole] = useState("");

  const [professional, setProfessional] = useState([]);
  const [sentReferrals, setSentReferrals] = useState([]);

  useEffect(() => {
    fetchMentors();
    fetchSentRequests();

  }, []);

  const fetchMentors = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://mentra-ne9a.onrender.com/api/users/mentors",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );


      setProfessional(res.data || []);
    } catch (error) {
      console.log(error);
      console.log("STATUS =", error.response?.status);
  console.log("URL =", error.config?.url);
  console.log("DATA =", error.response?.data);
    }
  };

  const fetchSentRequests = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
"https://mentra-ne9a.onrender.com/api/requests/my-sent-requests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      console.log("SENT REQUESTS =", res.data);

      setSentRequests(res.data);

    } catch (error) {
      console.log(error);
      console.log("STATUS =", error.response?.status);
  console.log("URL =", error.config?.url);
  console.log("DATA =", error.response?.data);
    }
  };

  const filtered = professional.filter((p) => {
    const tags = Array.isArray(p.tags) ? p.tags : [];

    const matchSearch =
      (p.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (p.role || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (p.company || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      tags.some((t) => (t || "").toLowerCase().includes(searchQuery.toLowerCase()));

    const matchReferral = filterReferral ? !!p.openToReferral : true;
    return matchSearch && matchReferral;
  });

  const handleSendRequest = async () => {
    try {
      if (!requestModal) return;

      const token = localStorage.getItem("token");

      await axios.post(
        "https://mentra-ne9a.onrender.com/api/requests",
        {
          mentorId: requestModal._id,
          desiredRole: jobRole,
          message: requestMessage,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Optimistically update UI
      setRequestedIds((prev) => [...prev, requestModal._id]);
      setSentReferrals((prev) => [
        ...prev,
        {
          id: requestModal._id,
          to: requestModal.name,
          avatar: requestModal.avatar || requestModal.name?.slice(0, 2) || "?",
          avatarColor: requestModal.avatarColor || "#5b4fcf",
          company: requestModal.company,
          role: jobRole,
          date: "Just now",
          status: "review",
        },
      ]);

      setRequestModal(null);
      setRequestMessage("");
      setJobRole("");
      setActiveTab("sent");
      alert("Request Sent Successfully");
    } catch (error) {
      console.log(error.response?.data);
      alert(JSON.stringify(error.response?.data));
      console.log("STATUS =", error.response?.status);
  console.log("URL =", error.config?.url);
  console.log("DATA =", error.response?.data);
    }
  };

  const statusBadge = (status) => {
    const styles = {
      pending: { bg: "#1e3a5f", color: "#60a5fa", label: "Pending" },
      accepted: { bg: "#14532d", color: "#4ade80", label: "Accepted" },
      review: { bg: "#3b2700", color: "#fbbf24", label: "Under Review" },
    };
    const s = styles[status] || styles.pending;
    return (
      <span
        style={{
          backgroundColor: s.bg,
          color: s.color,
          fontSize: "11px",
          fontWeight: 600,
          padding: "3px 10px",
          borderRadius: "20px",
        }}
      >
        {s.label}
      </span>
    );
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#0d1117", fontFamily: "'Segoe UI', sans-serif" }}
    >
      {/* Navbar */}
      <Navbar homePath="/connect" />

      {/* Body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className="w-100 shrink-0 justify-between flex flex-col py-6 px-4"
          style={{ backgroundColor: "#0d1117", borderRight: "1px solid #1e2530" }}
        >
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
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
            Switch to <strong>fresher</strong>
          </button>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8" style={{ backgroundColor: "#111827" }}>
          <h1 className="text-white font-black text-4xl mb-2">Network & Connect</h1>
          <p className="text-sm mb-6" style={{ color: "#8a9ab5" }}>
            Find peers, mentors and industry leaders — ask or give referrals.
          </p>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {["discover", "sent"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-5 py-2 rounded-xl text-sm font-semibold capitalize transition-all"
                style={
                  activeTab === tab
                    ? { backgroundColor: "#5b4fcf", color: "#fff" }
                    : {
                      backgroundColor: "#1e2530",
                      color: "#8a9ab5",
                      border: "1px solid #2e3a4e",
                    }
                }
              >
                {tab === "discover" ? "🔍 Discover" : "📤 Referrals Sent"}
              </button>
            ))}
          </div>

          {/* DISCOVER TAB */}
          {activeTab === "discover" && (
            <>
              {/* Search + Filter Row */}
              <div className="flex gap-3 mb-6">
                <div
                  className="flex-1 flex items-center gap-2 px-4 rounded-xl"
                  style={{
                    backgroundColor: "#1e2530",
                    border: "1px solid #2e3a4e",
                  }}
                >
                  <span style={{ color: "#8a9ab5" }}>🔍</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="flex-1 bg-transparent outline-none text-sm py-3"
                    style={{
                      backgroundColor: "#111827",
                      border: "1px solid #2e3a4e",
                      color: "#e2e8f0",
                    }}
                  />
                </div>
                <button
                  onClick={() => setFilterReferral(!filterReferral)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                  style={
                    filterReferral
                      ? {
                        backgroundColor: "#14532d",
                        color: "#4ade80",
                        border: "1px solid #166534",
                      }
                      : {
                        backgroundColor: "#1e2530",
                        color: "#8a9ab5",
                        border: "1px solid #2e3a4e",
                      }
                  }
                >
                  ✅ Open to Referral
                </button>
              </div>

              {/* Cards Grid */}
              <div
                className="grid grid-cols-1 gap-4"
                style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}
              >
                {filtered.map((p) => (
                  <div
                    key={p._id || p.id}
                    className="rounded-2xl p-5 flex flex-col gap-3"
                    style={{ backgroundColor: "#1e2a3a", border: "1px solid #2a3a50" }}
                  >
                    {/* Header */}
                    <div className="flex items-start gap-3">
                      <div className="relative shrink-0">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: p.avatarColor || "#5b4fcf" }}
                        >
                          {p.name ? p.name.slice(0, 2).toUpperCase() : "?"}

                        </div>
                        <span
                          className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
                          style={{
                            backgroundColor: p.status === "online" ? "#4ade80" : "#6b7280",
                            borderColor: "#1e2a3a",
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm">{p.name}</p>
                        <p className="text-xs" style={{ color: "#8a9ab5" }}>
                          {p.role || p.jobRole || p.designation || ""}
                        </p>
                        <p className="text-xs font-medium mt-0.5" style={{ color: "#5b4fcf" }}>
                          @ {p.company || p.companyName || p.organization || p.employer || ""}
                        </p>
                      </div>
                      {p.openToReferral && (
                        <span
                          className="text-xs font-semibold px-2 py-1 rounded-lg shrink-0"
                          style={{ backgroundColor: "#14532d", color: "#4ade80" }}
                        >
                          Open to Refer
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(p.tags) ? p.tags : []).map((tag, idx) => (
                        <span
                          key={`${tag}-${idx}`}
                          className="text-xs px-2 py-1 rounded-lg"
                          style={{
                            backgroundColor: "#111827",
                            color: "#8a9ab5",
                            border: "1px solid #2e3a4e",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Mutual */}
                    <p className="text-xs" style={{ color: "#8a9ab5" }}>
                      👥 {p.mutualConnections || 0} mutual connections
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => navigate(`/mentorProfile/${p._id}`)}
                        className="flex-1 py-2 rounded-xl text-sm font-semibold"
                        style={{
                          backgroundColor: "#5b4fcf",
                          color: "#fff",
                        }}
                      >
                        👤 View Profile
                      </button>
                      <button
                        onClick={() => {
                          const id = p._id || p.id;
                          if (!requestedIds.includes(id)) setRequestModal(p);
                        }}
                        className="flex-1 py-2 rounded-xl text-sm font-semibold"
                        style={
                          requestedIds.includes(p._id || p.id)
                            ? {
                              backgroundColor: "#3b2700",
                              color: "#fbbf24",
                              border: "1px solid #78350f",
                            }
                            : {
                              backgroundColor: "#1e2530",
                              color: "#8a9ab5",
                              border: "1px solid #2e3a4e",
                            }
                        }
                      >
                        {requestedIds.includes(p._id || p.id) ? "⏳ Requested" : "🤝 Ask Referral"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-16" style={{ color: "#8a9ab5" }}>
                  <div className="text-5xl mb-4">🔍</div>
                  <p className="text-sm">No professionals found matching your search.</p>
                </div>
              )}
            </>
          )}

          {/* SENT TAB */}
          {activeTab === "sent" && (
            <div className="flex flex-col gap-4">
              {sentReferrals.length === 0 ? (
                <div className="text-center py-16" style={{ color: "#8a9ab5" }}>
                  <div className="text-5xl mb-4">📤</div>
                  <p className="text-sm">You haven't sent any referral requests yet.</p>
                </div>
              ) : (
                sentRequests.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-2xl p-5 flex items-center justify-between"
                    style={{ backgroundColor: "#1e2a3a", border: "1px solid #2a3a50" }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                        style={{ backgroundColor: r.avatarColor || "#5b4fcf" }}
                      >
                        {r.avatar || "?"}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">To: {r.to}</p>
                        <p className="text-xs mt-0.5" style={{ color: "#8a9ab5" }}>
                          Referral request for{' '}
                          <span style={{ color: "#c4b5fd" }}>{r.role}</span> at{' '}
                          <span style={{ color: "#5b4fcf" }}>{r.company}</span>
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: "#4b5563" }}>
                          {r.date}
                        </p>

                      </div>
                    </div>
                    {statusBadge(r.status)}
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>

      {/* Referral Request Modal */}
      {requestModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setRequestModal(null);
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl p-6"
            style={{ backgroundColor: "#1e2a3a", border: "1px solid #2a3a50" }}
          >
            <h2 className="text-white font-bold text-xl mb-1">Request Referral</h2>
            <p className="text-sm mb-5" style={{ color: "#8a9ab5" }}>
              Sending request to <span style={{ color: "#c4b5fd" }}>{requestModal.name}</span> at{' '}
              {requestModal.company}
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: "#8a9ab5" }}>
                Role you're applying for
              </label>
              <input
                type="text"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{
                  backgroundColor: "#111827",
                  border: "1px solid #2e3a4e",
                  color: "#e2e8f0",
                }}
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium mb-2" style={{ color: "#8a9ab5" }}>
                Personal message
              </label>
              <textarea
                rows={4}
                placeholder="Introduce yourself and explain why you'd be a great fit..."
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                style={{
                  backgroundColor: "#111827",
                  border: "1px solid #2e3a4e",
                  color: "#e2e8f0",
                }}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setRequestModal(null)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold"
                style={{ backgroundColor: "#111827", color: "#8a9ab5", border: "1px solid #2e3a4e" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSendRequest}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white"
                style={{ backgroundColor: "#5b4fcf" }}
              >
                🤝 Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

