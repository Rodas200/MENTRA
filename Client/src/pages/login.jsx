import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import appLogo from "../assets/appLogo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "https://mentra-ne9a.onrender.com/api/users/login",
        {
          email,
          password,
        }
      );

      console.log(res.data);
      console.log("LOGIN RESPONSE:", res.data.user);

      localStorage.setItem("token", res.data.token);
      console.log("TOKEN SAVED =", res.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      if (res.data.user.role === "professional") {
        navigate("/mentor/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("LOGIN ERROR:", error);
      console.log("RESPONSE:", error.response?.data);

      alert(
        error.response?.data?.message ||
          "Login Failed"
      );
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col overflow-x-hidden"
      style={{
        backgroundColor: "#0d1117",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center px-4 py-6 sm:py-10 md:py-12">
        <div className="w-full max-w-md mx-auto">
          {/* Card */}
          <div
            className="rounded-2xl p-5 sm:p-6 md:p-8"
            style={{
              backgroundColor: "#161c27",
              border: "1px solid #1e2a3a",
            }}
          >
            {/* Logo */}
            <div className="flex justify-center mb-0">
              <div className="flex items-center">
                <img
                  className="w-24 h-20 sm:w-28 sm:h-24 md:w-32 md:h-28"
                  src={appLogo}
                  alt="logo"
                />
              </div>
            </div>

            <h1
              className="text-white text-2xl sm:text-3xl md:text-4xl font-black text-center mb-1 -mt-6 sm:-mt-7 md:-mt-8"
              style={{
                fontFamily: "'Segoe UI', sans-serif",
              }}
            >
              Welcome back..
            </h1>

            <p
              className="text-center text-sm mb-8"
              style={{ color: "#8a9ab5" }}
            >
              Log in to your Mentra account
            </p>

            {/* Form */}
            <div className="flex flex-col gap-4">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-medium"
                  style={{ color: "#a0aec0" }}
                >
                  Email address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="rohan14@example.com"
                  className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-gray-600"
                  style={{
                    backgroundColor: "#0d1117",
                    border: "1px solid #2e3a4e",
                  }}
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label
                    className="text-sm font-medium"
                    style={{ color: "#a0aec0" }}
                  >
                    Password
                  </label>

                  <a
                    href="#"
                    className="text-xs hover:underline"
                    style={{ color: "#7b6ff0" }}
                  >
                    Forgot password?
                  </a>
                </div>

                <div className="relative">
                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="••••••••"
                    className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-gray-600 pr-12"
                    style={{
                      backgroundColor: "#0d1117",
                      border: "1px solid #2e3a4e",
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs"
                    style={{ color: "#8a9ab5" }}
                  >
                    {showPassword
                      ? "Hide"
                      : "Show"}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                onClick={handleLogin}
                className="w-full rounded-xl py-3 text-white font-bold text-sm tracking-widest uppercase mt-2 transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: "#5b4fcf",
                }}
              >
                Log In
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div
                className="flex-1 h-px"
                style={{
                  backgroundColor: "#1e2a3a",
                }}
              />

              <span
                className="text-xs text-center"
                style={{ color: "#4a5568" }}
              >
                or continue with
              </span>

              <div
                className="flex-1 h-px"
                style={{
                  backgroundColor: "#1e2a3a",
                }}
              />
            </div>

            {/* Google Button */}
            <button
              className="w-full rounded-xl py-3 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 sm:gap-3 transition-all hover:opacity-90"
              style={{
                backgroundColor: "#0d1117",
                border: "1px solid #2e3a4e",
                color: "#d1d5db",
              }}
            >
              <svg
                className="w-4 h-4 shrink-0"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>

              <span className="truncate">
                Continue with Google
              </span>
            </button>

            {/* Sign Up */}
            <p
              className="text-center text-sm mt-6"
              style={{ color: "#8a9ab5" }}
            >
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold hover:underline"
                style={{ color: "#7b6ff0" }}
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}