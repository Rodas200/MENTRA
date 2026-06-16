import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../componets/Navbar.jsx";
import axios from "axios";
import MentorSidebar from "../componets/Mentorsidebar.jsx";



const T = {
  bgPrimary: "#0d1117",
  bgSecondary: "#161b27",
  bgCard: "#1a2033",
  bgInput: "#121827",
  border: "#252d42",
  accent: "#6b5ce7",
  accentLight: "#7c6ff0",
  accentDim: "rgba(107,92,231,0.15)",
  textPrimary: "#e8eaf0",
  textMuted: "#8892a4",
  textLabel: "#b0b8cc",
  success: "#22c55e",
  warning: "#f59e0b",
};

const IconInput = ({
  type = "text",
  placeholder,
  value,
  onChange,
  readOnly = false,
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      style={{
        width: "100%",
        background:  readOnly ? "#1a2033" :"#121827",
        border: "1px solid #252d42",
        borderRadius: "8px",
        color: "#e8eaf0",
        padding: "10px 14px",
        fontSize: "14px",
        outline: "none",
         cursor: readOnly ? "not-allowed" : "text",
      }}
    />
  );
};
export default function MentorProfile() {
  const { id } = useParams();

  const isPublicProfile = !!id;


  const [currentCompany, setCurrentCompany] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [previousCompany, setPreviousCompany] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [successRef, setSuccessRef] = useState(0);
  const [inProgressRef, setInProgressRef] = useState(0);
  const [openToReferral, setOpenToReferral] = useState(false);

  const [bio, setBio] = useState("");
  const [saved, setSaved] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const photoRef = useRef();



  useEffect(() => {
    console.log("PROFILE EFFECT");
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("TOKEN =", token);

      const url = id
        ? `https://mentra-ne9a.onrender.com/api/profile/${id}`
        : "https://mentra-ne9a.onrender.com/api/profile/me";


      console.log("URL =", url);

      const headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await axios.get(url, {
        headers,
      });

      const user = res.data.user ?? res.data;
      console.log("PROFILE USER =", user);

      setCurrentCompany(user?.currentCompany || "");
      setCurrentRole(user?.currentRole || "");
      setPreviousCompany(user?.previousCompany || "");
      setExperience(user?.experience || "");
      setLocation(user?.location || "");
      setBio(user?.mentorBio || "");
      setLinkedin(user?.mentorLinkedin || "");
      setGithub(user?.mentorGithub || "");
      setOpenToReferral(user?.openToReferral || false);
      setName(user?.name || "");
      setEmail(user?.email || "");

    }
    catch (error) {
      console.log("PROFILE ERROR =", error.response?.data);
      console.log(error);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      console.log("SENDING DATA =", {
        mentorBio: bio,
        mentorGithub: github,
        mentorLinkedin: linkedin,
        currentCompany,
        currentRole,
        previousCompany,
        experience,
        location,
        openToReferral,
      });

      await axios.put(
        "https://mentra-ne9a.onrender.com/api/profile/mentor-update",

        {

          mentorBio: bio,
          mentorLinkedin: linkedin,
          mentorGithub: github,
          currentCompany,
          currentRole,
          previousCompany,
          experience,
          location,
          openToReferral,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);


    } catch (error) {
      console.log(error);
      alert("Error Saving Mentor Profile");
    }
  };


  /* ── Shared input style (inline so theme always applies) ── */
  const inputStyle = (id) => ({
    width: "100%",
    background: T.bgInput,
    border: `1px solid ${T.border}`,
    borderRadius: 8,
    color: T.textPrimary,
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    padding: "10px 14px 10px 38px",
    outline: "none",
    boxShadow: "none",
    transition: "border-color .2s, box-shadow .2s",
  });


  const SectionHeader = ({ label }) => (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: T.accent, flexShrink: 0, display: "inline-block" }} />
        <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 15, color: T.textPrimary }}>
          {label}
        </span>
      </div>
      <div style={{ height: 1, background: T.border, marginBottom: 20 }} />
    </>
  );

  const cardStyle = {
    background: T.bgCard,
    border: `1px solid ${T.border}`,
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
  };

  const labelStyle = {
    fontSize: 12,
    fontWeight: 500,
    color: T.textMuted,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    marginBottom: 6,
    display: "block",
  };

  const fieldStyle = { display: "flex", flexDirection: "column", gap: 6 };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: T.bgSecondary,
        fontFamily: "'Inter', sans-serif",
        color: T.textPrimary,
      }}
    >



      {/* ── TOP NAV ── */}
      {!isPublicProfile && (
        <Navbar homePath="/mentor/dashboard" />
      )}
      {/* ── BODY ── */}
      <div style={{ display: "flex", flex: 1 }}>
        {!isPublicProfile && (
          <MentorSidebar />
        )}


        {/* ── MAIN ── */}
        <main style={{ flex: 1, padding: "36px 40px", Width: "100%", overflowY: "auto", background: T.bgSecondary }}>

          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 28, fontWeight: 700, color: T.textPrimary, marginBottom: 4 }}>
            {isPublicProfile ? "Mentor Profile" : "My Profile"}
          </h1>
          <p style={{ fontSize: 14, color: T.textMuted, marginBottom: 28 }}>
            {isPublicProfile
              ? "Professional details of the mentor."
              : "Keep your mentor profile updated to help candidates find the right referral match."}
          </p>

          {/* AVATAR CARD */}
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div
                onClick={() => {
                  if (!isPublicProfile) photoRef.current?.click();
                }}
                title="Upload photo"
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: T.accent,
                  display: "grid",
                  placeItems: "center",
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#fff",
                  flexShrink: 0,
                  cursor: isPublicProfile ? "default" : "pointer",
                  overflow: "hidden",
                }}
              >

                {photoPreview ? <img src={photoPreview} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (name?.charAt(0)?.toUpperCase() || "M")}
              </div>
              {!isPublicProfile && (
                <input
                  ref={photoRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handlePhotoChange}
                />
              )}
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 700, color: T.textPrimary }}>{name}</p>
                <p style={{ color: T.textMuted, fontSize: 13, margin: "3px 0 8px" }}>{email}</p>
                <span style={{
                  display: "inline-flex", alignItems: "center", padding: "3px 12px",
                  borderRadius: 999, fontSize: 12, fontWeight: 500,
                  background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.4)", color: "#4ade80",
                }}>
                  Mentor
                </span>
                {openToReferral && (
                  <div
                    style={{
                      marginTop: "8px",
                      background: "#14532d",
                      color: "#4ade80",
                      padding: "6px 10px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "600",
                      width: "fit-content",
                    }}
                  >
                    ✅ Open To Referral
                  </div>
                )}
              </div>
              {!isPublicProfile && (
                <button
                  onClick={() => photoRef.current?.click()}
                  style={{
                    marginLeft: "auto",
                    background: "transparent",
                    border: `1px solid ${T.border}`,
                    color: T.textPrimary,
                    padding: "8px 18px",
                    borderRadius: 8,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Edit Photo
                </button>
              )}
            </div>
          </div>

          {/* REFERRAL BANNER */}
          <div style={{
            background: "linear-gradient(135deg, rgba(107,92,231,0.2) 0%, rgba(107,92,231,0.05) 100%)",
            border: "1px solid rgba(107,92,231,0.35)",
            borderRadius: 12, padding: "20px 24px",
            display: "flex", alignItems: "center", gap: 20, marginBottom: 20,
          }}>
            <span style={{ fontSize: 36 }}>🎯</span>
            <div>
              <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 40, fontWeight: 700, color: T.accentLight, lineHeight: 1 }}>
                {totalReferrals || 0}
              </div>
              <div style={{ fontSize: 13, color: T.textMuted, marginTop: 2 }}>Total Referrals Given</div>
            </div>
            <div style={{ width: 1, height: 48, background: T.border }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: T.textLabel }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: T.success, display: "inline-block" }} />
                {successRef || 0} Successful placements
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: T.textLabel }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: T.warning, display: "inline-block" }} />
                {inProgressRef || 0} In-progress
              </div>
            </div>
          </div>

          {/* PROFESSIONAL DETAILS */}
          <div style={cardStyle}>
            <SectionHeader label="Professional Details" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Current Company</label>
                <IconInput
                  placeholder="e.g. Google"
                  value={currentCompany}
                  onChange={(e) => setCurrentCompany(e.target.value)}
                  readOnly={isPublicProfile}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Current Role / Designation</label>
                <IconInput
                  id="cc"
                  icon="🏢"
                  placeholder="e.g.software developer."
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  readOnly={isPublicProfile}
                />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Previous Company</label>
                <IconInput id="pc" icon="🏛️" placeholder="e.g. Infosys, Wipro, Flipkart…" value={previousCompany} onChange={e => setPreviousCompany(e.target.value)} 
                 readOnly={isPublicProfile}
                 />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Years of Experience</label>
                <IconInput id="exp" icon="📅" type="number" min="0" max="50" placeholder="e.g. 5" value={experience} onChange={e => setExperience(e.target.value)} 
                readOnly={isPublicProfile}
                />
               </div>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Location</label>
              <IconInput id="loc" icon="📍" placeholder="e.g.Noida, India" value={location} onChange={e => setLocation(e.target.value)} 
              readOnly={isPublicProfile}
              />
            </div>
          </div>

          {/* SOCIAL & PORTFOLIO LINKS */}
          <div style={cardStyle}>
            <SectionHeader label="Social & Portfolio Links" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>LinkedIn Profile</label>
                <IconInput id="li" icon="🔗" type="url" placeholder="https://linkedin.com/in/yourprofile" value={linkedin} onChange={e => setLinkedin(e.target.value)} 
                readOnly={isPublicProfile}
                />
               </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>GitHub Profile</label>
                <IconInput id="gh" icon="🐙" type="url" placeholder="https://github.com/yourusername" value={github} onChange={e => setGithub(e.target.value)} 
                readOnly={isPublicProfile}
                />
              </div>
            </div>
          </div>

          {/* REFERRALS GIVEN */}
          <div style={cardStyle}>
            <SectionHeader label="Referrals Given" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Total Referrals Given</label>
                <IconInput id="tr" icon="🎯" type="number" min="0" placeholder="e.g. 24" value={totalReferrals} onChange={e => setTotalReferrals(e.target.value)} 
                readOnly={isPublicProfile}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Successful Placements</label>
                <IconInput id="sp" icon="✅" type="number" min="0" placeholder="e.g. 18" value={successRef} onChange={e => setSuccessRef(e.target.value)} 
                readOnly={isPublicProfile}
                />
             </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>In-Progress Referrals</label>
                <IconInput id="ip" icon="⏳" type="number" min="0" placeholder="e.g. 6" value={inProgressRef} onChange={e => setInProgressRef(e.target.value)} 
                readOnly={isPublicProfile}
                />
              </div>
            </div>
          </div>

          {/* BIO */}
          <div style={cardStyle}>
            <SectionHeader label="Bio" />
            <textarea
              maxLength={500}
              rows={4}
              value={bio}
              onChange={e => setBio(e.target.value)}
              readOnly={isPublicProfile}
              onFocus={() => !isPublicProfile && setFocusedField("bio")}
              onBlur={() => !isPublicProfile && setFocusedField(null)}
              placeholder="Tell candidates about yourself — your expertise, what kind of roles you refer for, and what you look for in a candidate…"
              style={{
                width: "100%", background: T.bgInput, border: `1px solid ${focusedField === "bio" ? T.accent : T.border}`,
                borderRadius: 8, color: T.textPrimary, fontFamily: "'Inter', sans-serif",
                fontSize: 14, padding: "10px 14px", outline: "none", resize: "vertical", minHeight: 90,
                boxShadow: focusedField === "bio" ? "0 0 0 3px rgba(107,92,231,0.18)" : "none",
                transition: "border-color .2s, box-shadow .2s",
              }}
            />
            <p style={{ textAlign: "right", fontSize: 11, color: T.textMuted, marginTop: 4 }}>{bio.length} / 500</p>
          </div>

          {/* SAVE BUTTON */}
          {!isPublicProfile && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                paddingBottom: 24,
              }}
            >
              <button
                onClick={handleSave}
                style={{
                  background: saved ? T.success : T.accent,
                  color: "#fff",
                  border: "none",
                  padding: "11px 32px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "'Sora', sans-serif",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {saved ? "✓ Saved!" : <><span>💾</span> Save Profile</>}
              </button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}