import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../componets/Navbar.jsx";
import MentorSidebar from "../componets/Mentorsidebar.jsx";
import { useNavigate } from "react-router-dom";



// const queue = [
//   { applicant: "Ankit Sharma", target: "Junior React Dev", status: "Referred" },
//   { applicant: "Priya Rai", target: "Data Analyst", status: "Needs Improvement" },
//   { applicant: "Rahul V.", target: "UX Designer", status: "Pending" },
//   { applicant: "Sanya K.", target: "Backend Engineer", status: "Pending" },
// ];

const statusStyle = (status) => {
  switch (status) {
    case "Referred":
      return { backgroundColor: "#0d2e22", color: "#2ecc71", border: "1px solid #2ecc71" };
    case "Needs Improvement":
      return { backgroundColor: "#3a0e1e", color: "#e74c6f", border: "1px solid #e74c6f" };
    default:
      return { backgroundColor: "transparent", color: "#8a9ab5", border: "1px solid #2e3a4e" };
  }
};

export default function ReferralQueue() {

  const navigate = useNavigate();
 
   const [queue, setQueue] = useState([]);
   const [selectedRequest, setSelectedRequest] = useState(null);

const fetchRequests = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "https://mentra-ne9a.onrender.com/api/requests/mentor",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Mentor Requests:", res.data);

    setQueue(res.data);
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  fetchRequests();
}, []);


const updateStatus = async (status) => {
  console.log("Button Clicked:", status);

  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `https://mentra-ne9a.onrender.com/api/requests/${selectedRequest._id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert(`Request ${status}`);

    setSelectedRequest(null);

    fetchRequests();
  } catch (error) {
     console.log("UPDATE ERROR:", error);
  console.log("DATA:", error.response?.data);

  alert(
    error.response?.data?.message || "Update Failed")
  };
}

   return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#0d1117", fontFamily: "'Segoe UI', sans-serif" }}
    >
      {/* Navbar */}
    <Navbar homePath="/mentor/dashboard" />

      {/* Body */}
      <div className="flex flex-1">
        <MentorSidebar />


        {/* Main */}
        <main
          className="flex-1 p-8 overflow-y-auto"
          style={{ backgroundColor: "#0f172a" }}
        >
          <h1 className="text-white font-black text-4xl mb-6">
            Referral Queue
          </h1>

          {/* Table */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: "#161c27", border: "1px solid #1e2a3a" }}
          >
            {/* Header */}
            <div
              className="grid px-6 py-4"
              style={{
                gridTemplateColumns: "1.5fr 1.5fr 1.8fr 1.5fr",
                borderBottom: "1px solid #1e2a3a",
              }}
            >
              {["APPLICANT", "TARGET", "STATUS", "ACTIONS"].map((col) => (
                <span
                  key={col}
                  className="text-xs font-bold tracking-widest"
                  style={{ color: "#8a9ab5" }}
                >
                  {col}
                </span>
              ))}
            </div>

            {/* Rows */}
            {queue.map((row, i) => (
              <div
                key={row._id || row.requestId || row.fresher?._id || row.desiredRole || i}
                className="grid items-center px-6 py-5"

                style={{
                  gridTemplateColumns: "1.5fr 1.5fr 1.8fr 1.5fr",
                  borderBottom: i < queue.length - 1 ? "1px solid #1e2a3a" : "none",
                }}
              >
                {/* Applicant */}
                <span className="text-white font-bold text-sm leading-snug">
                 {row.fresher?.name}
                </span>

                {/* Target */}
                <span className="text-sm leading-snug" style={{ color: "#8a9ab5" }}>
                  {row.desiredRole}
                </span>

                {/* Status */}
                <span>
                  <span
                    className="text-xs font-semibold px-3 py-1.5 rounded-md inline-block"
                    style={statusStyle(row.status)}
                  >
                    {row.status}
                  </span>
                </span>

                {/* Action */}
                <span>
                  <button
                   onClick={() => {
                    console.log(row);
                    setSelectedRequest(row);
                    }}
                    className="text-sm font-bold leading-snug"
                    style={{ color: "#7b6ff0" }}
                  >
                    Review Application
                  </button>
                </span>
              </div>
            ))}
          </div>
        </main>
   {selectedRequest && (
  <div
    className="fixed inset-0 flex items-center justify-center z-50"
    style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
  >
    <div
      className="w-full max-w-lg rounded-2xl p-6"
      style={{
        backgroundColor: "#1e2a3a",
        border: "1px solid #2a3a50",
      }}
    >
      <h2 className="text-white text-xl font-bold mb-4">
        Review Application
      </h2> 

      <p className="text-white mb-2">
        <strong>Applicant:</strong>{" "}
        {selectedRequest.fresher?.name}
      </p>

      <p className="text-white mb-2">
        <strong>Role:</strong>{" "}
        {selectedRequest.desiredRole}
      </p>

      <p className="text-white mb-2">
        <strong>Status:</strong>{" "}
        {selectedRequest.status}
      </p>

      <p className="text-white mb-4">
        <strong>Message:</strong>{" "}
        {selectedRequest.message}
      </p>

      <div className="flex gap-2 mt-5">
      <button
        onClick={() =>
        navigate(`/profile/${selectedRequest.fresher._id}`)
    }
         className="px-4 py-2 rounded-lg text-white"
         style={{ backgroundColor: "#2563eb" }}
     >
           👤View Profile
        </button>
       <button
    onClick={() => updateStatus("Referred")}
    className="px-4 py-2 rounded-lg text-white"
    style={{ backgroundColor: "#16a34a" }}
  >
    Referred
  </button>

  <button
    onClick={() => updateStatus("Needs Improvement")}
    className="px-4 py-2 rounded-lg text-white"
    style={{ backgroundColor: "#dc2626" }}
  >
    Need Improvement
  </button>

  <button
    onClick={() => setSelectedRequest(null)}
    className="px-4 py-2 rounded-lg text-white"
    style={{ backgroundColor: "#5b4fcf" }}
  >
    Close
  </button>
</div>
    </div>
  </div>
)}
      </div>
    </div>
  );
}