import { useState } from "react";
import { useNotificationContext } from "../context/NotificationContext";
import { Card, CardContent } from "../components/Card";

function FeedbackModule({ role }) {
  role = "Admin";
  const feedback = [
    {
      name: "John Doe",
      email: "john@example.com",
      message: "Great service!",
      status: "Pending"
    },
  ];

  const [feedbacks, setFeedbacks] = useState(feedback);
  const [newFeedback, setNewFeedback] = useState({ name: "", email: "", message: "" });
  const { showNotification } = useNotificationContext() || {};
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
    setNewFeedback({ name: "", email: "", message: "" });
    showNotification("Feedback submitted successfully!", "success");
    setSubmitted(false);
  };

  const updateStatus = (index, newStatus) => {
    setFeedbacks(feedbacks.map((fb, i) => (i === index ? { ...fb, status: newStatus } : fb)));
  };

  const updateRemark = (index, remark) => {
    setFeedbacks(feedbacks.map((fb, i) => (i === index ? { ...fb, remarks: remark } : fb)));
  };

  const sortedFeedbacks = feedbacks.filter(fb => fb.status === sortOrder || sortOrder === "All");

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
            <div className="mb-4 flex justify-between items-center">
              <label className="font-medium">Sort by Status:</label>
              <select className="p-2 border rounded" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
            {sortedFeedbacks.length === 0 ? (
              <p className="text-gray-500">No feedback available.</p>
            ) : (
              sortedFeedbacks.map((fb, index) => (
                <div key={index} className="border p-3 rounded mb-2 bg-gray-100">
                  <p><b>{fb.name}</b> ({fb.email})</p>
                  <p>{fb.message}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status: {fb.status}</span>
                    <select
                      className="ml-2 p-1 border rounded"
                      value={fb.status}
                      onChange={(e) => updateStatus(index, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Reviewed">Reviewed</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                  <textarea
                    className="w-full p-2 border rounded mt-2"
                    placeholder="Add remarks..."
                    value={fb.remarks}
                    onChange={(e) => updateRemark(index, e.target.value)}
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
