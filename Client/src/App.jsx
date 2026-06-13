import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/signup.jsx";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Requests from "./pages/Requests";
import Advice from "./pages/Advice";
import Connect from "./pages/Connect";
import MentorDashboard from "./pages/MentorDashboard";
import ReferredRequest from "./pages/ReferredRequest";
import MentorProfile from "./pages/MentorProfile";
import ReviewCenter from "./pages/ReviewCenter";
import MentorConnect from "./pages/MentorConnect";
import ProtectedRoute from "./ProtectedRoute";
import ComingSoon from "./pages/ComingSoon.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />


        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />


        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests"
          element={
            <ProtectedRoute>
              <Requests />
            </ProtectedRoute>

          }
        />
        <Route
          path="/advice"
          element={
            <ProtectedRoute>
              <ComingSoon />
            </ProtectedRoute>
          }
        />

        <Route
          path="/connect"
          element={
            <ProtectedRoute>
              <Connect />
            </ProtectedRoute>
          }
        /><Route
          path="/mentorProfile/:id"
          element={<MentorProfile />}
        />
        <Route path="/mentor/Dashboard" element={<MentorDashboard />} />
        <Route path="/referredRequest" element={<ReferredRequest />} />
        <Route path="/mentorProfile" element={<MentorProfile />} />
        <Route path="/reviewCenter" element={<ComingSoon />} />
        <Route path="/mentorConnect" element={<MentorConnect />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;