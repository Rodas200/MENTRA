import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../componets/Navbar.jsx";


const navItems = [
  { icon: "🏠", label: "Dashboard", path: "/dashboard", active: false },
  { icon: "👤", label: "Profile", path: "/profile", active: true },
  { icon: "📋", label: "My Request", path: "/requests", active: false },
  { icon: "💬", label: "Connect", path: "/connect", active: false },
  { icon: "💡", label: "Advice", path: "/advice", active: false },
];


const SKILL_SUGGESTIONS = ["React", "Node.js", "Python", "TypeScript", "Tailwind CSS", "MongoDB", "SQL", "AWS", "Docker", "Figma"];

export default function FresherProfile() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isPublicProfile = !!id;

  const [bio, setBio] = useState("");
  const [github, setGithub] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [skills, setSkills] = useState(["React", "Node.js"]);
  const [skillInput, setSkillInput] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumeDragging, setResumeDragging] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const fileInputRef = useRef();
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = id
`https://mentra-ne9a.onrender.com/api/profile/${id}`
"https://mentra-ne9a.onrender.com/api/profile/me"

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Fetched Profile:", res.data);
      console.log("Resume URL:", res.data.resume);

      setBio(res.data.bio || "");
      setGithub(res.data.github || "");
      setLinkedin(res.data.linkedin || "");
      setSkills(res.data.skills || []);
      setPortfolio(res.data.portfolio || "");
      setResumeUrl(res.data.resume || "");

      // Header fields (shown in avatar/name row)
      setName(res.data.name || "");
      setEmail(res.data.email || "");

    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };


  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
"https://mentra-ne9a.onrender.com/api/users/profile",
        {
          bio,
          github,
          linkedin,
          portfolio,
          skills,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Saved Profile:", res.data);
      alert("Profile Saved Successfully");
    } catch (error) {
      console.log(error);
      alert("Error Saving Profile");
    }
  };


  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setSkillInput("");
  };

  const removeSkill = (skill) => setSkills(skills.filter((s) => s !== skill));

  const handleDrop = (e) => {
    e.preventDefault();
    setResumeDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setResumeFile(file);
  };


  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setResumeFile(file);

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("resume", file);

      const res = await axios.post(
"https://mentra-ne9a.onrender.com/api/profile/upload-resume",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Resume uploaded successfully");
      setResumeUrl(res.data.resume);
      fetchProfile();

      console.log(res.data);

    } catch (error) {
      console.log(error);
      alert("Resume upload failed");
    }
  };
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0d1117", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Navbar */}
      {!isPublicProfile && <Navbar homePath="/dashboard" />}
      {/* Body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        {!isPublicProfile && (
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
            <button className="w-full py-3 rounded-xl text-lg font-semibold text-white" style={{ backgroundColor: "#1e293b" }}>
              Switch to <strong>Mentor</strong>
            </button>
          </aside>
        )}

        {/* Main */}
        <main className="flex-1 p-8 overflow-y-auto" style={{ backgroundColor: "#0f172a" }}>
          <h1 className="text-white font-black text-4xl mb-2">My Profile</h1>
          <p className="text-sm mb-8" style={{ color: "#8a9ab5" }}>Keep your profile updated to get better referral matches.</p>

          <div className= "clfx flex-col gap-6">

            {/* Avatar + Name Row */}
            <div className="rounded-2xl p-6 flex items-center gap-6" style={{ backgroundColor: "#161c27", border: "1px solid #1e2a3a" }}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-black shrink-0" style={{ backgroundColor: "#5b4fcf" }}>
                {photoPreview ? <img src={photoPreview} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (name?.charAt(0)?.toUpperCase() || "F")}

              </div>
              <div className="flex flex-col gap-1">
                <p className="text-white font-bold text-xl">{name}</p>
                <p className="text-sm" style={{ color: "#8a9ab5" }}>{email}</p>
                <span className="text-xs px-3 py-1 rounded-full w-fit font-semibold mt-1" style={{ backgroundColor: "#1e2a3a", color: "#7b6ff0", border: "1px solid #5b4fcf" }}>
                  Fresher
                </span>
              </div>
              {!isPublicProfile && (
                <button className="ml-auto text-sm font-bold px-4 py-2 rounded-xl" style={{ color: "#7b6ff0", border: "1px solid #5b4fcf", backgroundColor: "#1a1f35" }}>
                  Edit Photo
                </button>
              )}
            </div>

            {/* Bio */}
            <div className="rounded-2xl p-6" style={{ backgroundColor: "#161c27", border: "1px solid #1e2a3a" }}>
              <h2 className="text-white font-bold text-base mb-4">Bio</h2>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                readOnly={isPublicProfile}
                placeholder="Tell mentors about yourself — your background, goals, and what kind of referral you're looking for..."
                className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none resize-none placeholder:text-gray-600"
                style={{ backgroundColor: "#0f172a", border: "1px solid #2e3a4e" }}
              />
              <p className="text-xs mt-2 text-right" style={{ color: "#4a5568" }}>{bio.length}/500</p>
            </div>

            {/* Resume Upload */}
            <div className="rounded-2xl p-6" style={{ backgroundColor: "#161c27", border: "1px solid #1e2a3a" }}>
              <h2 className="text-white font-bold text-base mb-4">Resume</h2>
              <div
                onDragOver={(e) => { e.preventDefault(); setResumeDragging(true); }}
                onDragLeave={() => setResumeDragging(false)}
                onDrop={handleDrop}
                onClick={() => {
                  if (!isPublicProfile) {
                    fileInputRef.current.click();
                  }
                }
                }
                className="rounded-xl flex flex-col items-center justify-center py-10 px-6 cursor-pointer transition-all"
                style={{
                  border: `2px dashed ${resumeDragging ? "#5b4fcf" : "#2e3a4e"}`,
                  backgroundColor: resumeDragging ? "#1a1f35" : "#0f172a",
                }}
              >
                <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />
                {resumeFile || resumeUrl ? (
                  <>
                    <div className="text-3xl mb-3">📄</div>
                    <p className="text-white font-semibold text-sm">{resumeFile ? resumeFile.name : resumeUrl}</p>
                    {resumeUrl && (
                      <button
                        onClick={() =>
                          window.open(
                            `http://mentra-ne9a.onrender.com/uploads/${resumeUrl}`,
                            "_blank"
                          )
                        }
                        className="mt-3 px-4 py-2 rounded-lg text-white font-semibold"
                        style={{ backgroundColor: "#5b4fcf" }}
                      >
                        View Resume
                      </button>
                    )}
                    {resumeFile && (
                      <p
                        className="text-xs mt-1"
                        style={{ color: "#8a9ab5" }}
                      >
                        {(resumeFile.size / 1024).toFixed(1)} KB
                      </p>
                    )}
                  </>
                ) : (

                  <>
                    {!isPublicProfile && (
                      <div className="text-3xl mb-3">📁
                        <p className="text-white font-semibold text-sm">Drag & drop your resume here</p>
                        <p className="text-xs mt-1" style={{ color: "#8a9ab5" }}>or click to browse — PDF, DOC, DOCX</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="rounded-2xl p-6" style={{ backgroundColor: "#161c27", border: "1px solid #1e2a3a" }}>
              <h2 className="text-white font-bold text-base mb-4">Skills</h2>

              {/* Chips */}
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.map((skill) => (
                  <span
                    key={skill}

                    className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: "#1a1f35", color: "#7b6ff0", border: "1px solid #5b4fcf" }}
                  >
                    {skill}
                    {!isPublicProfile && (
                      <button
                        onClick={() => removeSkill(skill)}
                        className="hover:text-red-400 transition-colors text-xs leading-none"
                      >
                        ✕
                      </button>
                    )}
                  </span>
                ))}
              </div>

              {/* Input */}
              {!isPublicProfile && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    readOnly={isPublicProfile}
                    onKeyDown={(e) => { if (e.key === "Enter") addSkill(skillInput); }}
                    placeholder="Add a skill and press Enter..."
                    className="flex-1 rounded-xl px-4 py-2.5 text-sm text-white outline-none placeholder:text-gray-600"
                    style={{ backgroundColor: "#0f172a", border: "1px solid #2e3a4e" }}
                  />
                  {!isPublicProfile && (
                    <button
                      onClick={() => addSkill(skillInput)}
                      className="px-4 py-2.5 rounded-xl text-sm font-bold text-white"
                      style={{ backgroundColor: "#5b4fcf" }}
                    >
                      Add
                    </button>
                  )}
                </div>
              )}

              {/* Suggestions */}
              {!isPublicProfile && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {SKILL_SUGGESTIONS.filter((s) => !skills.includes(s)).map((s) => (
                    <button
                      key={s}
                      onClick={() => addSkill(s)}
                      className="text-xs px-3 py-1 rounded-full transition-all hover:border-purple-500"
                      style={{
                        backgroundColor: "#0f172a",
                        color: "#8a9ab5",
                        border: "1px solid #2e3a4e",
                      }}
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Links */}
            <div className="rounded-2xl p-6" style={{ backgroundColor: "#161c27", border: "1px solid #1e2a3a" }}>
              <h2 className="text-white font-bold text-base mb-5">Profile Links</h2>
              <div className="flex flex-col gap-4">
                {/* LinkedIn */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold tracking-widest uppercase" style={{ color: "#8a9ab5" }}>LinkedIn</label>
                  <div className="flex items-center rounded-xl overflow-hidden" style={{ border: "1px solid #2e3a4e", backgroundColor: "#0f172a" }}>
                    <span className="px-4 py-3 text-sm border-r shrink-0" style={{ color: "#5b4fcf", borderColor: "#2e3a4e", backgroundColor: "#1a1f35" }}>
                      in
                    </span>
                    <input
                      type="url"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      readOnly={isPublicProfile}
                      placeholder="https://linkedin.com/in/yourname"
                      className="flex-1 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 bg-transparent"
                    />
                  </div>
                </div>

                {/* GitHub */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold tracking-widest uppercase" style={{ color: "#8a9ab5" }}>GitHub</label>
                  <div className="flex items-center rounded-xl overflow-hidden" style={{ border: "1px solid #2e3a4e", backgroundColor: "#0f172a" }}>
                    <span className="px-4 py-3 text-sm border-r shrink-0" style={{ color: "#5b4fcf", borderColor: "#2e3a4e", backgroundColor: "#1a1f35" }}>
                      GH
                    </span>
                    <input
                      type="url"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      readOnly={isPublicProfile}
                      placeholder="https://github.com/yourname"
                      className="flex-1 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 bg-transparent"
                    />
                  </div>
                </div>

                {/* Portfolio */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold tracking-widest uppercase" style={{ color: "#8a9ab5" }}>Portfolio Website</label>
                  <div className="flex items-center rounded-xl overflow-hidden" style={{ border: "1px solid #2e3a4e", backgroundColor: "#0f172a" }}>
                    <span className="px-4 py-3 text-sm border-r shrink-0" style={{ color: "#5b4fcf", borderColor: "#2e3a4e", backgroundColor: "#1a1f35" }}>
                      🌐
                    </span>
                    <input
                      type="url"
                      value={portfolio}
                      onChange={(e) => setPortfolio(e.target.value)}
                      readOnly={isPublicProfile}
                      placeholder="https://yourportfolio.com"
                      className="flex-1 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 bg-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pb-4">
              {!isPublicProfile && (
                <button
                  onClick={handleSaveProfile}
                  className="px-10 py-3 rounded-xl text-white font-bold text-sm tracking-widest uppercase transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#5b4fcf" }}
                >
                  Save Profile
                </button>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}