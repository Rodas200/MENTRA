import { useState } from "react";
import Navbar from "../componets/Navbar.jsx";
import MentorSidebar from "../componets/Mentorsidebar.jsx";

const SKILLS = ["DSA", "System Design", "Resume", "Projects", "Communication", "Behavioral", "Open Source", "Networking"];




const initialRequests = [
  {
    id: 1,
    name: "Rohan Das",
    avatar: "R",
    role: "Fresher • B.Tech CSE 2024",
    bio: "Looking for referral at Google or Amazon. Strong in React and Node.js. Need feedback on my resume and DSA prep.",
    skills: ["React", "Node.js", "DSA"],
    status: "pending",
    submittedAt: "2 hours ago",
    resumeUrl: "#",
  },
  {
    id: 2,
    name: "Priya Sharma",
    avatar: "P",
    role: "Fresher • MCA 2024",
    bio: "Passionate about backend development. Have 2 internships. Looking for guidance on System Design and referral at Microsoft.",
    skills: ["Java", "Spring Boot", "SQL"],
    status: "pending",
    submittedAt: "5 hours ago",
    resumeUrl: "#",
  },
  {
    id: 3,
    name: "Ankit Verma",
    avatar: "A",
    role: "Fresher • B.E. IT 2023",
    bio: "1 year of experience as junior dev. Want to switch to a product company. Need review of my portfolio and interview prep tips.",
    skills: ["Python", "Django", "AWS"],
    status: "reviewed",
    submittedAt: "1 day ago",
    resumeUrl: "#",
  },
  {
    id: 4,
    name: "Neha Gupta",
    avatar: "N",
    role: "Fresher • B.Tech ECE 2024",
    bio: "Transitioning from ECE to SWE. Completed DSA course, built 3 projects. Need honest feedback on my profile strength.",
    skills: ["C++", "DSA", "React"],
    status: "pending",
    submittedAt: "3 hours ago",
    resumeUrl: "#",
  },
];

/* ── Design tokens ── */
const T = {
  bgPrimary:   "#0d1117",
  bgSecondary: "#161b27",
  bgCard:      "#1a2033",
  bgInput:     "#121827",
  border:      "#252d42",
  accent:      "#6b5ce7",
  accentLight: "#7c6ff0",
  textPrimary: "#e8eaf0",
  textMuted:   "#8892a4",
  success:     "#22c55e",
  warning:     "#f59e0b",
  danger:      "#ef4444",
};

export default function ReviewCenter() {
  const [requests, setRequests]     = useState(initialRequests);
  const [selected, setSelected]     = useState(null);
  const [feedback, setFeedback]     = useState("");
  const [skillTags, setSkillTags]   = useState([]);
  const [rating, setRating]         = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [filterStatus, setFilterStatus] = useState("all");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);

  const filtered = requests.filter(r =>
    filterStatus === "all" ? true : r.status === filterStatus
  );

  const pendingCount  = requests.filter(r => r.status === "pending").length;
  const reviewedCount = requests.filter(r => r.status === "reviewed").length;

  const toggleSkill = (s) =>
    setSkillTags(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const openReview = (req) => {
    setSelected(req);
    setFeedback("");
    setSkillTags([]);
    setRating(0);
    setSubmitted(false);
  };

  const submitReview = () => {
    if (!feedback.trim() || rating === 0) return;
    setSubmitting(true);
    setTimeout(() => {
      setRequests(prev => prev.map(r => r.id === selected.id ? { ...r, status: "reviewed" } : r));
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => { setSelected(null); setSubmitted(false); }, 1500);
    }, 800);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: T.bgSecondary, fontFamily: "'Segoe UI', sans-serif", color: T.textPrimary }}>

      {/* ── NAVBAR ── */}
      <Navbar homePath="/mentor/dashboard" />

      {/* ── BODY ── */}
      <div style={{ display: "flex", flex: 1 }}>

        <MentorSidebar />


        {/* ── MAIN ── */}
        <main style={{ flex: 1, padding: "32px 36px", overflowY: "auto", background: T.bgSecondary }}>

          {/* Header */}
          <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 4 }}>Review Center</h1>
          <p style={{ fontSize: 13, color: T.textMuted, marginBottom: 28 }}>
            Review fresher profiles, give actionable feedback, and help them land their first job faster.
          </p>

          {/* Stats Row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
            {[
              { label: "Pending Reviews", value: pendingCount, color: T.warning, icon: "⏳" },
              { label: "Reviewed",        value: reviewedCount, color: T.success, icon: "✅" },
              { label: "Total Requests",  value: requests.length, color: T.accentLight, icon: "📋" },
            ].map(stat => (
              <div key={stat.label} style={{
                background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12,
                padding: "18px 22px", display: "flex", alignItems: "center", gap: 14,
              }}>
                <span style={{ fontSize: 28 }}>{stat.icon}</span>
                <div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {["all", "pending", "reviewed"].map(f => (
              <button key={f} onClick={() => setFilterStatus(f)} style={{
                padding: "7px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                border: `1px solid ${filterStatus === f ? T.accent : T.border}`,
                background: filterStatus === f ? T.accent : "transparent",
                color: filterStatus === f ? "#fff" : T.textMuted,
                cursor: "pointer", textTransform: "capitalize",
              }}>
                {f === "all" ? "All Requests" : f === "pending" ? "⏳ Pending" : "✅ Reviewed"}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {filtered.map(req => (
              <div key={req.id} style={{
                background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14,
                padding: "22px 24px", display: "flex", flexDirection: "column", gap: 12,
              }}>
                {/* Top row */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: "50%", background: T.accent, flexShrink: 0,
                    display: "grid", placeItems: "center", fontSize: 18, fontWeight: 700, color: "#fff",
                  }}>
                    {req.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontWeight: 700, fontSize: 15 }}>{req.name}</span>
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999,
                        background: req.status === "pending" ? "rgba(245,158,11,0.12)" : "rgba(34,197,94,0.12)",
                        border: `1px solid ${req.status === "pending" ? "rgba(245,158,11,0.4)" : "rgba(34,197,94,0.4)"}`,
                        color: req.status === "pending" ? T.warning : T.success,
                      }}>
                        {req.status === "pending" ? "⏳ Pending" : "✅ Reviewed"}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>{req.role}</div>
                  </div>
                </div>

                {/* Bio */}
                <p style={{ fontSize: 13, color: "#c8d3e0", lineHeight: 1.6, margin: 0 }}>{req.bio}</p>

                {/* Skills */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {req.skills.map(s => (
                    <span key={s} style={{
                      fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999,
                      background: "#1a1f35", color: T.accentLight, border: `1px solid ${T.accent}`,
                    }}>{s}</span>
                  ))}
                </div>

                {/* Footer */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: `1px solid ${T.border}` }}>
                  <span style={{ fontSize: 11, color: T.textMuted }}>🕐 {req.submittedAt}</span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <a href={req.resumeUrl} style={{
                      fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 8,
                      border: `1px solid ${T.border}`, color: T.textMuted, textDecoration: "none",
                      background: "transparent",
                    }}>📄 Resume</a>
                    <button onClick={() => openReview(req)} style={{
                      fontSize: 12, fontWeight: 700, padding: "6px 16px", borderRadius: 8,
                      border: "none", cursor: "pointer", color: "#fff",
                      background: req.status === "reviewed" ? "#1e293b" : T.accent,
                    }}>
                      {req.status === "reviewed" ? "View Review" : "✍️ Give Review"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* ── REVIEW MODAL ── */}
      {selected && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.75)",
        }}>
          <div style={{
            width: "100%", maxWidth: 560, borderRadius: 18, padding: 32,
            background: T.bgCard, border: `1px solid ${T.border}`,
            maxHeight: "90vh", overflowY: "auto",
          }}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ fontSize: 52, marginBottom: 12 }}>🎉</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: T.success, marginBottom: 6 }}>Review Submitted!</div>
                <div style={{ fontSize: 13, color: T.textMuted }}>{selected.name} will receive your feedback shortly.</div>
              </div>
            ) : (
              <>
                {/* Modal Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Review {selected.name}</h2>
                    <p style={{ fontSize: 12, color: T.textMuted, margin: "4px 0 0" }}>{selected.role}</p>
                  </div>
                  <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: T.textMuted, fontSize: 20, cursor: "pointer", lineHeight: 1 }}>✕</button>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: T.border, marginBottom: 20 }} />

                {/* Star Rating */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 10 }}>
                    Overall Profile Rating
                  </label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[1,2,3,4,5].map(star => (
                      <span key={star}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        style={{ fontSize: 28, cursor: "pointer", color: (hoverRating || rating) >= star ? "#f59e0b" : T.border, transition: "color .15s" }}
                      >★</span>
                    ))}
                    {rating > 0 && (
                      <span style={{ fontSize: 12, color: T.textMuted, alignSelf: "center", marginLeft: 6 }}>
                        {["","Needs Work","Below Average","Average","Good","Excellent"][rating]}
                      </span>
                    )}
                  </div>
                </div>

                {/* Skill Areas */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 10 }}>
                    Areas to Improve (select all that apply)
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {SKILLS.map(s => (
                      <button key={s} onClick={() => toggleSkill(s)} style={{
                        fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 999, cursor: "pointer",
                        border: `1px solid ${skillTags.includes(s) ? T.accent : T.border}`,
                        background: skillTags.includes(s) ? T.accent : "transparent",
                        color: skillTags.includes(s) ? "#fff" : T.textMuted,
                        transition: "all .15s",
                      }}>{s}</button>
                    ))}
                  </div>
                </div>

                {/* Feedback Textarea */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
                    Detailed Feedback
                  </label>
                  <textarea
                    rows={5}
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                    placeholder="Give honest, actionable advice. E.g. — Your resume needs a stronger project section. Focus on system design fundamentals before applying to FAANG roles..."
                    style={{
                      width: "100%", background: T.bgInput, border: `1px solid ${T.border}`,
                      borderRadius: 10, color: T.textPrimary, fontFamily: "'Segoe UI', sans-serif",
                      fontSize: 13, padding: "12px 14px", outline: "none", resize: "vertical",
                      boxSizing: "border-box",
                    }}
                  />
                  <div style={{ textAlign: "right", fontSize: 11, color: T.textMuted, marginTop: 4 }}>{feedback.length} / 1000</div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setSelected(null)} style={{
                    flex: 1, padding: "11px 0", borderRadius: 10, fontSize: 13, fontWeight: 600,
                    background: "transparent", border: `1px solid ${T.border}`, color: T.textMuted, cursor: "pointer",
                  }}>Cancel</button>
                  <button onClick={submitReview} disabled={!feedback.trim() || rating === 0 || submitting} style={{
                    flex: 2, padding: "11px 0", borderRadius: 10, fontSize: 13, fontWeight: 700,
                    background: (!feedback.trim() || rating === 0) ? "#2a2f45" : T.accent,
                    color: (!feedback.trim() || rating === 0) ? T.textMuted : "#fff",
                    border: "none", cursor: (!feedback.trim() || rating === 0) ? "not-allowed" : "pointer",
                    transition: "background .2s",
                  }}>
                    {submitting ? "Submitting…" : "✅ Submit Review"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}