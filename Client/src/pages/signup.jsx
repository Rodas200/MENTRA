import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import appLogo from "../assets/appLogo.png";


export default function Signup() {
  const [role, setRole] = useState("fresher"); // "fresher" | "professional"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      if (!name || !email || !password || !confirmPassword) {
        alert("Please fill all fields");
        return;
      }

      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/users/register",
        {
          name,
          email,
          password,
          role,
        }
      );

      alert("Account created successfully");

      navigate("/");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Signup failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0d1117", fontFamily: "'Segoe UI', sans-serif" }}>


      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div
            className="rounded-2xl p-8"
            style={{ backgroundColor: "#161c27", border: "1px solid #1e2a3a" }}
          >
            {/* Logo mark */}
            <div className="flex justify-center mb-6">
              <div
                className="flex items-center  "
              >
                <img className="w-32 h-28" src={appLogo} alt="logo" />
              </div>
            </div>

            <h1 className="text-white text-3xl font-black text-center mb-1 -mt-10">
              Create account
            </h1>
            <p className="text-center text-sm mb-6" style={{ color: "#8a9ab5" }}>
              Join Mentra and start connecting
            </p>

            {/* Role Toggle */}
            <div
              className="flex rounded-xl p-1 mb-6"
              style={{ backgroundColor: "#0d1117", border: "1px solid #1e2a3a" }}
            >
              <button
                onClick={() => setRole("fresher")}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={
                  role === "fresher"
                    ? { backgroundColor: "#5b4fcf", color: "#fff" }
                    : { color: "#8a9ab5" }
                }
              >
                🎓 Fresher
              </button>
              <button
                onClick={() => setRole("professional")}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={
                  role === "professional"
                    ? { backgroundColor: "#5b4fcf", color: "#fff" }
                    : { color: "#8a9ab5" }
                }
              >
                💼 Professional
              </button>
            </div>

            {/* Role Description */}
            <div
              className="rounded-xl px-4 py-3 mb-5 text-sm"
              style={{ backgroundColor: "#0d1117", border: "1px solid #1e2a3a", color: "#8a9ab5" }}
            >
              {role === "fresher"
                ? "Connect with professionals and mentors to request referrals and kickstart your career."
                : "Help freshers by giving referrals, and connect with peers for your own career moves."}
            </div>

            {/* Form */}
            <div className="flex flex-col gap-4">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={{ color: "#a0aec0" }}>
                  Full name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ankit Sharma"
                  className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-gray-600"
                  style={{ backgroundColor: "#0d1117", border: "1px solid #2e3a4e" }}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={{ color: "#a0aec0" }}>
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-gray-600"
                  style={{ backgroundColor: "#0d1117", border: "1px solid #2e3a4e" }}
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={{ color: "#a0aec0" }}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-gray-600 pr-12"
                    style={{ backgroundColor: "#0d1117", border: "1px solid #2e3a4e" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs"
                    style={{ color: "#8a9ab5" }}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={{ color: "#a0aec0" }}>
                  Confirm password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-gray-600"
                  style={{ backgroundColor: "#0d1117", border: "1px solid #2e3a4e" }}
                />
              </div>

              {/* Terms */}
              <p className="text-xs" style={{ color: "#4a5568" }}>
                By signing up, you agree to Mentra's{" "}
                <a href="#" className="hover:underline" style={{ color: "#7b6ff0" }}>Terms of Service</a>{" "}
                and{" "}
                <a href="#" className="hover:underline" style={{ color: "#7b6ff0" }}>Privacy Policy</a>.
              </p>

              {/* Sign up Button */}
              <button
                onClick={handleSignup}
                className="w-full rounded-xl py-3 text-white font-bold text-sm tracking-widest uppercase mt-1 transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#5b4fcf" }}
              >
                Create Account
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px" style={{ backgroundColor: "#1e2a3a" }} />
              <span className="text-xs" style={{ color: "#4a5568" }}>or continue with</span>
              <div className="flex-1 h-px" style={{ backgroundColor: "#1e2a3a" }} />
            </div>

            {/* Google */}
            <button
              className="w-full rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-3 transition-all hover:opacity-90"
              style={{ backgroundColor: "#0d1117", border: "1px solid #2e3a4e", color: "#d1d5db" }}
            >
              <svg className="w-4 h-4" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              Continue with Google
            </button>

            {/* Login link */}
            <p className="text-center text-sm mt-6" style={{ color: "#8a9ab5" }}>
              Already have an account?{" "}
              <Link
                to="/"
                className="font-semibold hover:underline"
                style={{ color: "#7b6ff0" }}
              >
                Log in
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}