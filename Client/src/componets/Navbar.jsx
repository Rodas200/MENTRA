import { useState } from "react";
import { useNavigate } from "react-router-dom";

import appLogo from "../assets/appLogo.png";

export default function Navbar({ homePath }) {
  const navigate = useNavigate();

  const [showResourcesPopup, setShowResourcesPopup] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <>
      <nav
        className="flex items-center justify-between px-8 py-4 shrink-0"
        style={{
          backgroundColor: "#0d1117",
          borderBottom: "1px solid #1e2530",
        }}
      >
        {/* Logo */}
        <div className=" h-10 flex items-center justify-center ">
          <div
            className="-mx-8 flex items-center  "
          
          >
            <img className="w-32 h-28" src={appLogo} alt="logo"/>
          </div>

          <span className="text-white font-bold text-xl tracking-wide">
            Mentra
          </span>
        </div>

        {/* Right Side Buttons */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate(homePath)}
            className="flex items-center gap-1.5 text-gray-300 hover:text-white text-sm"
          >
            <span>🏠</span>
            Home
          </button>

          <button
            onClick={() => setShowResourcesPopup(true)}
            className="flex items-center gap-1.5 text-gray-300 hover:text-white text-sm"
          >
            <span>📖</span>
            Resources
          </button>

          <div className="w-px h-5 bg-gray-600" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white"
            style={{
              backgroundColor: "#1e2530",
              border: "1px solid #2e3a4e",
            }}
          >
            <span>👤</span>
            Logout
          </button>
        </div>
      </nav>

      {/* Resources Popup */}
      {showResourcesPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
          }}
        >
          <div
            className="p-8 rounded-2xl text-center"
            style={{
              backgroundColor: "#1a2235",
              border: "1px solid #2e3a4e",
              width: "420px",
            }}
          >
            <h2 className="text-white text-2xl font-bold mb-3">
              🚧 Coming Soon
            </h2>

            <p className="text-gray-300 mb-6">
              Resources section is currently under development.
              We are working on it and it will be available soon.
            </p>

            <button
              onClick={() => setShowResourcesPopup(false)}
              className="px-5 py-2 rounded-lg text-white font-semibold"
              style={{
                backgroundColor: "#5b4fcf",
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}