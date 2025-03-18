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
    <div className="p-4">
      <div className="mb-5">
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">Public Feedback & Complaints System</h2>
            <p className="text-gray-500">Voice out your concern and feedback!</p>
          </CardContent>
        </Card>
      </div>

      <Card className="w-full">
        {role === "User" && (
          <form onSubmit={handleSubmit} className="mb-6">
            <input
              type="text"
              placeholder="Name"
              value={newFeedback.name}
              onChange={(e) => setNewFeedback({ ...newFeedback, name: e.target.value })}
              className={`w-full p-2 border rounded mb-3 ${submitted && !newFeedback.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            <input
              type="email"
              placeholder="Email"
              value={newFeedback.email}
              onChange={(e) => setNewFeedback({ ...newFeedback, email: e.target.value })}
              className={`w-full p-2 border rounded mb-3 ${submitted && !newFeedback.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            <textarea
              placeholder="Your message..."
              value={newFeedback.message}
              onChange={(e) => setNewFeedback({ ...newFeedback, message: e.target.value })}
              className={`w-full p-2 border rounded mb-3 ${submitted && !newFeedback.message ? 'border-red-500' : 'border-gray-300'}`}
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full cursor-pointer">Submit</button>
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
                  className="flex items-center gap-2 bg-white p-2 border rounded shadow-md hover:bg-gray-100 transition cursor-pointer"
                >
                  <Filter size={18} className="text-gray-600" />
                  <span className="font-medium"> {sortOrder}</span>
                </button>

              </div>

              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
                  <ul className="py-2 text-sm text-gray-700">
                    {["All", "Pending", "Reviewed", "Resolved"].map((status) => (
                      <li key={status}>
                        <button
                          className={`block w-full px-4 py-2 text-left hover:bg-blue-100 ${sortOrder === status ? "font-bold text-blue-600" : ""
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
              <p className="text-gray-500">No feedback available.</p>
            ) : (
              sortedFeedbacks.map((fb, index) => (
                <div key={index} className="border p-3 rounded mb-2 bg-gray-100">
                  <p><b>{fb.name}</b> {fb.email !== "N/A" && (
                    <div className="flex flex-row gap-4 mb-1">
                      <Mail />
                      <a href={`mailto:${fb.email}`} className="text-blue-500 hover:underline">
                        {fb.email}
                      </a>
                    </div>
                  )} </p>
                  <p>{fb.message}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-lg
                      ${fb.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                          fb.status === "Reviewed" ? "bg-blue-100 text-blue-700" :
                            "bg-green-100 text-green-700"}`
                      }
                    >
                      {fb.status === "Pending" && "⏳ Pending"}
                      {fb.status === "Reviewed" && "🔍 Reviewed"}
                      {fb.status === "Resolved" && "✅ Resolved"}
                    </span>

                    <select
                      className="ml-2 p-1.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition ease-in-out duration-150 cursor-pointer"
                      value={fb.status}
                      onChange={(e) => updateStatus(fb.id, e.target.value)}
                    >
                      <option value="Pending" className="text-yellow-500 font-semibold">
                        ⏳ Pending
                      </option>
                      <option value="Reviewed" className="text-blue-600 font-semibold">
                        🔍 Reviewed
                      </option>
                      <option value="Resolved" className="text-green-600 font-semibold">
                        ✅ Resolved
                      </option>
                    </select>

                  </div>
                  <textarea
                    className="w-full p-2 border rounded mt-2"
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
  );
}

export default FeedbackModule;
