import { useState, useEffect } from "react";
import { Mail, Filter } from "lucide-react";
import { useNotificationContext } from "../context/NotificationContext";
import { Card, CardContent } from "../components/Card";
import { useToggle } from "../hooks/useToggle";
import SmartCityVideo from "../assets/videos/Smart-City.mp4";
import useDarkMode from "../hooks/DarkMode.jsx";
import { db } from "../../config/firebase";
import { addDoc, updateDoc, doc, collection, getDocs,deleteDoc } from "firebase/firestore";
import { auth } from "../../config/firebase";
import { Trash2 } from "lucide-react";

function FeedbackModule({ userRole }) {
  // 1. Original state declarations (unchanged)
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState({ name: "", email: "", message: "" });
  const notificationContext = useNotificationContext();
  const showNotification = notificationContext ? notificationContext.showNotification : () => {};
  const [isOpen, toggleOpen] = useToggle(false);
  const [submitted, setSubmitted] = useState(false);
  const [sortOrder, setSortOrder] = useState("Pending");
  const isDarkMode = useDarkMode();
  const feedback_data = collection(db, "user_feedback")
  const [user, setUser] = useState({});
  const user_collection = collection(db, "users");
  const [profile, setProfile] = useState({
    name: user?.name,
    dob: user?.dob,
    address: user?.address,
    ic_number: user?.ic_number,
    avatar_url: user?.avatar_url,
  });
  const handleDeleteAll = async () => {
    // Check if there are any feedbacks to delete
    if (!feedbacks || feedbacks.length === 0) {
      showNotification("No feedbacks to delete", "error");
      return;
    }
  
    // Confirm before deletion
    if (!window.confirm("Are you sure you want to delete ALL feedbacks? This cannot be undone.")) {
      return;
    }
  
    try {
      // Filter out only feedbacks that have valid IDs (from Firebase)
      const feedbacksToDelete = feedbacks.filter(fb => typeof fb.id === 'string');
      
      // Delete from Firebase
      const deletePromises = feedbacksToDelete.map(fb => 
        deleteDoc(doc(db, "user_feedback", fb.id))
      );
      await Promise.all(deletePromises);
  
      // Update local state
      setFeedbacks([]);
      showNotification("All feedbacks deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting feedbacks:", error);
      showNotification("Failed to delete feedbacks", "error");
    }
  };

    useEffect(() => {
      let ignore = false;
      const get_user = async() => {
        try{
          const user_data = await getDocs(user_collection);
          if(!ignore){
          const filteredData = user_data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          filteredData.forEach(user => {
            if(user.id === auth.currentUser.uid){
              setUser(user);
              setProfile({
                name: user.name || '',
                dob: user.dob?.toDate() || null,
                address: user.address || '',
                ic_number: user.ic_number || '',
                avatar_url: user.avatar_url,
              });
            }
          });
        }
        }catch (err){
          console.log(err);
        }
      };
      get_user();
      return ()=> {ignore = true};
    },[]);

    useEffect(() => {
      if (profile?.name) {
        setNewFeedback(prev => ({
          ...prev,
          name: profile.name,
          email: auth.currentUser.email
        }));
      }
    }, [profile?.name,profile?.email]); // This runs whenever profile.name changes

  // 2. Initialize data with Firebase (only addition)
  useEffect(() => {
    const initializeData = async () => {
      try {
        const snapshot = await getDocs(collection(db, "system_feedback"));
        const firebaseData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const user_Feedbacks = await getDocs(feedback_data);
        const userFeedbacks = user_Feedbacks.docs.map((doc) => ({
          ...doc.data(), // Spread the document data
          id: doc.id,    // Include the document ID
        }));
        setFeedbacks([
          ...firebaseData,
          ...userFeedbacks,
          {
            id: 104,
            message: "The park benches in my neighborhood are broken and need replacement",
            category: "Infrastructure",
            name: "Charlie Brown",
            email: "charlie@example.com",
            status: "Pending",
            remark: "",
            date: new Date().toISOString()
          }
        ]);
      } catch (error) {
        console.error("Firebase load error:", error);
        // Fallback to original data if Firebase fails
        setFeedbacks([
          ...userFeedbacks,
          {
            id: 104,
            message: "The park benches in my neighborhood are broken and need replacement",
            category: "Infrastructure",
            name: "Charlie Brown",
            email: "charlie@example.com",
            status: "Pending",
            remark: "",
            date: new Date().toISOString()
          }
        ]);
      }
    };
    initializeData();
  }, []);

  // 3. Original handleSubmit with Firebase addition
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!profile.name || !auth.currentUser.email || !newFeedback.message) {
      showNotification("Please fill in the required field!", "error");
      return;
    }

    // Preserve original ID generation
    const newId = Math.max(...feedbacks.map(fb => fb.id), 0) + 1;
    const newEntry = { 
      ...newFeedback, 
      id: newId,
      status: "Pending",
      date: new Date().toISOString()
    };

    // Add to Firebase (non-blocking)
    addDoc(collection(db, "user_feedback"), newEntry)
      .catch(err => console.error("Firebase save error:", err));

    // Original state update (unchanged)
    setFeedbacks([...feedbacks, newEntry]);
    setNewFeedback({ name: "", email: "", message: "", remark: "" });
    showNotification("Feedback submitted successfully!", "success");
    setSubmitted(false);
  };

  // 4. Original updateStatus with Firebase sync
  const updateStatus = (id, newStatus) => {
    // Original local update
    setFeedbacks(feedbacks.map((fb) => (fb.id === id ? { ...fb, status: newStatus } : fb)));
    showNotification(`Status updated to ${newStatus}`, "info");

    // Sync to Firebase (non-blocking)
    updateDoc(doc(db, "user_feedback", id), { status: newStatus })
      .catch(err => console.error("Firebase update error:", err));
  };

  // 5. Original updateRemark with Firebase sync
  const updateRemark = (id, remark) => {
    // Original local update
    setFeedbacks(feedbacks.map((fb) => (fb.id === id ? { ...fb, remark } : fb)));

    // Sync to Firebase (non-blocking)
    updateDoc(doc(db, "user_feedback", id), { remark })
      .catch(err => console.error("Firebase remark update error:", err));
  };

  // 6. Original filter logic (unchanged)
  const sortedFeedbacks = feedbacks.filter(fb => 
    fb.status.toLowerCase() === sortOrder.toLowerCase() || sortOrder === "All"
  );


  // 7. Original render method (completely unchanged)
  return (
    <div className="relative min-h-screen">
      {/* Background video */}
      <div className="fixed inset-0 z-0 overflow-hidden ml-20">
        <video
          autoPlay
          loop
          muted
          className={`w-full h-full object-cover ${isDarkMode ? "opacity-50" : "opacity-30"}`}
        >
          <source src={SmartCityVideo} type="video/mp4" />
        </video>
      </div>

      <div className={`fixed inset-0 -z-10 ml-20 ${
        isDarkMode ? "bg-[hsla(180,0%,10%,0.8)]" : "bg-[hsla(0,0%,100%,0.8)]"
      }`} />

      <div className="relative z-10 p-4 ml-3">
        <div className="mb-5">
          <Card className={`${isDarkMode ? "bg-[hsla(180,0%,10%,0.8)]" : "bg-white/80"} shadow-lg`}>
            <CardContent>
              <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Public Feedback & Complaints System
              </h2>
              <p className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Voice out your concern and feedback!
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className={`w-full ${isDarkMode ? "bg-[hsla(180,0%,10%,0.8)]" : "bg-white/80"} shadow-lg`}>
          {userRole === "User" && (
            <form onSubmit={handleSubmit} className="mb-6">
              <input
                type="text"
                placeholder="Name"
                value={profile?.name}
                onChange={(e) => setNewFeedback({ ...newFeedback, name: e.target.value })}
                className={`w-full p-2 border rounded mb-3 ${
                  isDarkMode 
                    ? "bg-gray-700 text-white placeholder-gray-400" 
                    : "bg-white/90 text-gray-900 placeholder-gray-500"
                } ${
                  submitted && !newFeedback.name 
                    ? 'border-red-500' 
                    : isDarkMode ? "border-gray-600" : "border-gray-300"
                }`}
              />
              <input
                type="email"
                placeholder="Email"
                value={auth.currentUser?.email}
                onChange={(e) => setNewFeedback({ ...newFeedback, email: e.target.value })}
                className={`w-full p-2 border rounded mb-3 ${
                  isDarkMode 
                    ? "bg-gray-700 text-white placeholder-gray-400" 
                    : "bg-white/90 text-gray-900 placeholder-gray-500"
                } ${
                  submitted && !newFeedback.email 
                    ? 'border-red-500' 
                    : isDarkMode ? "border-gray-600" : "border-gray-300"
                }`}
              />
              <textarea
                placeholder="Your message..."
                value={newFeedback.message}
                onChange={(e) => setNewFeedback({ ...newFeedback, message: e.target.value })}
                className={`w-full p-2 border rounded mb-3 ${
                  isDarkMode 
                    ? "bg-gray-700 text-white placeholder-gray-400" 
                    : "bg-white/90 text-gray-900 placeholder-gray-500"
                } ${
                  submitted && !newFeedback.message 
                    ? 'border-red-500' 
                    : isDarkMode ? "border-gray-600" : "border-gray-300"
                }`}
              />
              <button 
                type="submit" 
                className={`${
                  isDarkMode 
                    ? "bg-blue-600 hover:bg-blue-700" 
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white px-4 py-2 rounded w-full cursor-pointer transition`}
              >
                Submit
              </button>
            </form>
          )}

          {userRole === "Admin" && (
            <div>
              <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Admin Panel - Feedback Management
              </h3>
              <div className="mb-4 relative inline-block w-full">
              <div className="flex justify-end gap-2">  {/* Added gap-2 for spacing between buttons */}
  <button
    onClick={toggleOpen}
    className={`flex items-center gap-2 ${
      isDarkMode 
        ? "bg-gray-700 border-gray-600 hover:bg-gray-600" 
        : "bg-gray-100 border-gray-300 hover:bg-gray-200"
    } p-2 border rounded shadow-md transition cursor-pointer`}
  >
    <Filter size={18} className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`} />
    <span className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
      {sortOrder}
    </span>
  </button>
  
  {/* Delete Button */}
  {/* <button
    onClick={handleDeleteAll}
    className={`flex items-center gap-2 ${
      isDarkMode 
        ? "bg-red-700 border-red-600 hover:bg-red-600" 
        : "bg-red-100 border-red-300 hover:bg-red-200"
    } p-2 border rounded shadow-md transition cursor-pointer`}
  >
    <Trash2 size={18} className={`${isDarkMode ? "text-gray-300" : "text-red-700"}`} />
    <span className={`font-medium ${isDarkMode ? "text-gray-300" : "text-red-700"}`}>
      Delete All
    </span>
  </button> */}
</div>

                {isOpen && (
                  <div className={`absolute right-0 mt-2 w-48 ${
                    isDarkMode 
                      ? "bg-gray-800 border-gray-700" 
                      : "bg-white border-gray-200"
                  } border rounded shadow-lg z-10`}>
                    <ul className={`py-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      {["All", "Pending", "Reviewed", "Resolved"].map((status) => (
                        <li key={status}>
                          <button
                            className={`block w-full px-4 py-2 text-left ${
                              isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                            } ${
                              sortOrder === status 
                                ? `font-bold ${isDarkMode ? "text-blue-400" : "text-blue-500"}` 
                                : ""
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
                <p className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  No feedback available.
                </p>
              ) : (
                sortedFeedbacks.map((fb, index) => (
                  <div 
                    key={index} 
                    className={`border ${
                      isDarkMode ? "border-gray-700" : "border-gray-200"
                    } p-3 rounded mb-2 ${
                      isDarkMode ? "bg-gray-800" : "bg-white/90"
                    } shadow-sm`}
                  >
                    <p className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      <b>{fb.name}</b> {fb.email !== "N/A" && (
                        <div className="flex flex-row gap-4 mb-1">
                          <Mail className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`} />
                          <a 
                            href={`mailto:${fb.email}`} 
                            className={`${
                              isDarkMode ? "text-blue-400" : "text-blue-600"
                            } hover:underline`}
                          >
                            {fb.email}
                          </a>
                        </div>
                      )}
                    </p>
                    <p className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      {fb.message}
                    </p>
                    <div className="mt-2 flex justify-between items-center">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-lg ${
                          fb.status === "Pending" 
                            ? isDarkMode 
                              ? "bg-yellow-800 text-yellow-300" 
                              : "bg-yellow-100 text-yellow-800"
                            : fb.status === "Reviewed"
                              ? isDarkMode
                                ? "bg-blue-800 text-blue-300"
                                : "bg-blue-100 text-blue-800"
                              : isDarkMode
                                ? "bg-green-800 text-green-300"
                                : "bg-green-100 text-green-800"
                        }`}
                      >
                        {fb.status === "Pending" && "⏳ Pending"}
                        {fb.status === "Reviewed" && "🔍 Reviewed"}
                        {fb.status === "Resolved" && "✅ Resolved"}
                      </span>

                      <select
                        className={`ml-2 p-1.5 border rounded-lg shadow-sm focus:ring-2 focus:border-blue-500 transition ease-in-out duration-150 cursor-pointer ${
                          isDarkMode 
                            ? "bg-gray-700 text-gray-300 border-gray-600 focus:ring-gray-500 focus:border-gray-500" 
                            : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
                        }`}
                        value={fb.status}
                        onChange={(e) => updateStatus(fb.id, e.target.value)}
                      >
                        <option value="Pending" className={`${isDarkMode ? "text-yellow-300" : "text-yellow-800"} font-semibold`}>
                          ⏳ Pending
                        </option>
                        <option value="Reviewed" className={`${isDarkMode ? "text-blue-300" : "text-blue-800"} font-semibold`}>
                          🔍 Reviewed
                        </option>
                        <option value="Resolved" className={`${isDarkMode ? "text-green-300" : "text-green-800"} font-semibold`}>
                          ✅ Resolved
                        </option>
                      </select>
                    </div>
                    <textarea
                      className={`w-full p-2 border rounded mt-2 placeholder-gray-500 ${
                        isDarkMode 
                          ? "bg-gray-700 text-gray-300 border-gray-600 placeholder-gray-400" 
                          : "bg-white text-gray-900 border-gray-300"
                      }`}
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