import { useState } from "react";
import { Mail, Filter } from "lucide-react";
import { useNotificationContext } from "../context/NotificationContext";
import { Card, CardContent } from "../components/Card";
import { systemFeedbacks, userFeedbacks } from "../data";
import { useToggle } from "../hooks/useToggle";

function FeedbackModule({ role = "Admin" }) {
  const [feedbacks, setFeedbacks] = useState([...systemFeedbacks, ...userFeedbacks]);
  const [newFeedback, setNewFeedback] = useState({ name: "", email: "", message: "" });
  const notificationContext = useNotificationContext();
  const showNotification = notificationContext ? notificationContext.showNotification : () => { };
  const [isOpen, toggleOpen] = useToggle(false);
  const [submitted, setSubmitted] = useState(false);
  const [sortOrder, setSortOrder] = useState("Pending");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!newFeedback.name || !newFeedback.email || !newFeedback.message) {
      showNotification("Please fill in the required field!", "error");
      return;
    }

    setFeedbacks([...feedbacks, { ...newFeedback, status: "Pending" }]);
    setNewFeedback({ name: "", email: "", message: "", remark: "" });
    showNotification("Feedback submitted successfully!", "success");
    setSubmitted(false);
  };

  const updateStatus = (id, newStatus) => {
    setFeedbacks(feedbacks.map((fb) => (fb.id === id ? { ...fb, status: newStatus } : fb)));
  };
  
  const updateRemark = (id, remark) => {
    setFeedbacks((prevFeedbacks) =>
      prevFeedbacks.map((fb) =>
        fb.id === id ? { ...fb, remark } : fb
      )
    );
  };

  const sortedFeedbacks = feedbacks.filter(fb => fb.status.toLowerCase() === sortOrder.toLowerCase() || sortOrder === "All");

  return (
    <div className="relative min-h-screen">
      {/* Background Layer */}
      <div className="fixed inset-0 bg-[hsla(180,0%,10%,0.8)] -z-10 ml-20" /> {/* Add `ml-20` to avoid covering the sidebar */}

      {/* Content */}
      <div className="p-4"> {/* Adjust `ml-20` to match the sidebar width */}
        <div className="mb-5">
          <Card className="bg-[hsla(180,0%,10%,0.8)] text-white">
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">Public Feedback & Complaints System</h2>
              <p className="text-gray-300">Voice out your concern and feedback!</p>
            </CardContent>
          </Card>
        </div>

        <Card className="w-full bg-[hsla(180,0%,10%,0.8)] text-white">
          {role === "User" && (
            <form onSubmit={handleSubmit} className="mb-6">
              <input
                type="text"
                placeholder="Name"
                value={newFeedback.name}
                onChange={(e) => setNewFeedback({ ...newFeedback, name: e.target.value })}
                className={`w-full p-2 border rounded mb-3 bg-gray-700 text-white placeholder-gray-400 ${submitted && !newFeedback.name ? 'border-red-500' : 'border-gray-600'}`}
              />
              <input
                type="email"
                placeholder="Email"
                value={newFeedback.email}
                onChange={(e) => setNewFeedback({ ...newFeedback, email: e.target.value })}
                className={`w-full p-2 border rounded mb-3 bg-gray-700 text-white placeholder-gray-400 ${submitted && !newFeedback.email ? 'border-red-500' : 'border-gray-600'}`}
              />
              <textarea
                placeholder="Your message..."
                value={newFeedback.message}
                onChange={(e) => setNewFeedback({ ...newFeedback, message: e.target.value })}
                className={`w-full p-2 border rounded mb-3 bg-gray-700 text-white placeholder-gray-400 ${submitted && !newFeedback.message ? 'border-red-500' : 'border-gray-600'}`}
              />
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full cursor-pointer hover:bg-blue-600 transition">
                Submit
              </button>
            </form>
          )}

          {role === "Admin" && (
            <div>
              <h3 className="text-xl font-semibold mb-3">Admin Panel - Feedback Management</h3>
              <div className="mb-4 relative inline-block w-full">
                {/* Filter Button */}
                <div className="flex justify-end">
                  <button
                    onClick={toggleOpen}
                    className="flex items-center gap-2 bg-gray-700 p-2 border border-gray-600 rounded shadow-md hover:bg-gray-600 transition cursor-pointer"
                  >
                    <Filter size={18} className="text-gray-300" />
                    <span className="font-medium text-gray-300"> {sortOrder}</span>
                  </button>
                </div>

                {isOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-white-700 rounded shadow-lg z-10">
                    <ul className="py-2 text-sm text-gray-300">
                      {["All", "Pending", "Reviewed", "Resolved"].map((status) => (
                        <li key={status}>
                          <button
                            className={`block w-full px-4 py-2 text-left hover:bg-gray-700 ${sortOrder === status ? "font-bold text-blue-400" : ""
                              }`}
                            onClick={() => {
                              setSortOrder(status);
                              toggleOpen();
                            }}
                          >
                            {status}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {sortedFeedbacks.length === 0 ? (
                <p className="text-gray-400">No feedback available.</p>
              ) : (
                sortedFeedbacks.map((fb, index) => (
                  <div key={index} className="border border-gray-700 p-3 rounded mb-2 bg-gray-800">
                    <p><b>{fb.name}</b> {fb.email !== "N/A" && (
                      <div className="flex flex-row gap-4 mb-1">
                        <Mail className="text-gray-300" />
                        <a href={`mailto:${fb.email}`} className="text-blue-400 hover:underline">
                          {fb.email}
                        </a>
                      </div>
                    )} </p>
                    <p className="text-gray-300">{fb.message}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-lg
                        ${fb.status === "Pending" ? "bg-yellow-800 text-yellow-300" :
                            fb.status === "Reviewed" ? "bg-blue-800 text-blue-300" :
                              "bg-green-800 text-green-300"}`
                        }
                      >
                        {fb.status === "Pending" && "⏳ Pending"}
                        {fb.status === "Reviewed" && "🔍 Reviewed"}
                        {fb.status === "Resolved" && "✅ Resolved"}
                      </span>

                      <select
                        className="ml-2 p-1.5 border border-gray-600 rounded-lg bg-gray-700 text-gray-300 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition ease-in-out duration-150 cursor-pointer"
                        value={fb.status}
                        onChange={(e) => updateStatus(fb.id, e.target.value)}
                      >
                        <option value="Pending" className="text-yellow-300 font-semibold">
                          ⏳ Pending
                        </option>
                        <option value="Reviewed" className="text-blue-300 font-semibold">
                          🔍 Reviewed
                        </option>
                        <option value="Resolved" className="text-green-300 font-semibold">
                          ✅ Resolved
                        </option>
                      </select>
                    </div>
                    <textarea
                      className="w-full p-2 border border-white-600 rounded mt-2 bg-gray-700 text-gray-300 placeholder-gray-400"
                      placeholder="Add remarks..."
                      value={fb.remark || ""}
                      onChange={(e) => updateRemark(fb.id, e.target.value)}
                    />
                  </div>
                ))
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default FeedbackModule;