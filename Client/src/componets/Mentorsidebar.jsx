import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  {
    icon: "🏠",
    label: "Dashboard",
    path: "/mentor/dashboard",
  },
  {
    icon: "👤",
    label: "Profile",
    path: "/mentorProfile",
  },
  {
    icon: "📋",
    label: "Referred Requests",
    path: "/referredRequest",
  },
  {
    icon: "💬",
    label: "Connect",
    path: "/mentorConnect",
  },
  {
    icon: "⭐",
    label: "Review Center",
    path: "/reviewCenter",
  },
];

export default function MentorSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside
      className="w-100 shrink-0 flex flex-col justify-between py-8 px-6"
      style={{
        backgroundColor: "#0d1117",
        borderRight: "1px solid #1e2530",
      }}
    >
      <div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-semibold w-full text-left transition-all"
                style={
                  isActive
                    ? {
                        backgroundColor: "#5b4fcf",
                        color: "#fff",
                      }
                    : {
                        color: "#8a9ab5",
                      }
                }
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <button
        className="w-full py-3 rounded-xl text-sm font-semibold text-white"
        style={{ backgroundColor: "#1e293b" }}
      >
        Switch to Fresher
      </button>
    </aside>
  );
}