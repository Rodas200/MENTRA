import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import Requests from "./pages/Requests.jsx";
import Advice from "./pages/Advice.jsx";
import Connect from "./pages/Connect.jsx";
import MentorDashboard from "./pages/MentorDashboard.jsx";
import ReferredRequest from "./pages/ReferredRequest.jsx";
import MentorProfile from "./pages/MentorProfile.jsx";
import ReviewCenter from "./pages/ReviewCenter.jsx";
import MentorConnect from "./pages/MentorConnect.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
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