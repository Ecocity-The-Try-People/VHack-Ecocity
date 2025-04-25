import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/Card";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import userProfileImage from "@/assets/png/user.png";
import SmartCityVideo from "@/assets/videos/Smart-City.mp4";
import useDarkMode from "@/hooks/DarkMode.jsx";
import { useNotificationContext } from "../context/NotificationContext";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { auth } from "../../config/firebase";

export default function ProfileModule({ userRole }) {
  const user_collection = collection(db, "users");
  const [user, setUser] = useState({});
  const [icError, setIcError] = useState("");

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

  const { showNotification } = useNotificationContext() || {};
  const [profile, setProfile] = useState({
    name: user?.name,
    dob: user?.dob,
    address: user?.address,
    ic_number: user?.ic_number,
    avatar_url: user?.avatar_url,
  });

  const fileInputRef = useRef(null);
  const isDarkMode = useDarkMode();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for IC number
    if (name === "ic_number") {
      // Only allow numbers
      const numericValue = value.replace(/\D/g, '');
      
      // Validate length (max 12 digits)
      if (numericValue.length > 12) {
        return; // Don't update if exceeds 12 digits
      }
      
      setProfile({
        ...profile,
        [name]: numericValue,
      });
      
      // Set error message if not exactly 12 digits (but allow empty input)
      if (numericValue.length > 0 && numericValue.length !== 12) {
        setIcError("IC number must be exactly 12 digits");
      } else {
        setIcError("");
      }
    } else {
      setProfile({
        ...profile,
        [name]: value,
      });
    }
  };

  const handleDateChange = (date) => {
    setProfile({
      ...profile,
      dob: date,
    });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        if (imageUrl.length > 1_000_000) { // 1MB in characters (approx.)
          setError("Image URL is too large. Please choose a smaller image.");
          return;
        }
        setProfile({
          ...profile,
          avatar_url: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangePictureClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (profile.ic_number && profile.ic_number.length !== 12) {
      setIcError("Invalid IC Number");
      showNotification("Please enter a valid IC number", "error");
      return;
    }
    
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, profile);
      showNotification("Profile updated successfully!", "success");
    } catch (error) {
      console.error("Error updating profile:", error);
      showNotification("Failed to update profile", "error");
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0 overflow-hidden ml-20">
        <video
          autoPlay
          loop
          muted
          className={`w-full h-full object-cover ${isDarkMode ? "opacity-50" : "opacity-30"}`}
        >
          <source src={SmartCityVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className={`fixed inset-0 z-0 ml-20 ${isDarkMode ? "from-[hsla(180,0%,10%,0.6)] to-[hsla(180,0%,15%,0.7)]" : "from-white/20 to-white/40"} bg-gradient-to-b`} />

      <div className="relative z-10 p-4 ml-20">
        <div className="max-w-2xl mx-auto">
          <Card className={`${isDarkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90 border-gray-200"} p-8 rounded-lg shadow-xl border`}>
            <CardContent>
              <h2 className={`text-3xl font-bold text-center mb-6 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
                User Profile
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col items-center">
                  <div className={`w-32 h-32 rounded-full border-4 overflow-hidden shadow-md ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}>
                    <img
                      src={profile.avatar_url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={handleChangePictureClick}
                    className={`cursor-pointer mt-4 ${isDarkMode ? "bg-blue-700 hover:bg-blue-800" : "bg-blue-600 hover:bg-blue-700"} text-white py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200`}
                  >
                    Change Picture
                  </button>
                </div>

                <div>
                  <label htmlFor="name" className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${isDarkMode ? "bg-gray-700/90 text-gray-200 placeholder-gray-500 border-gray-600" : "bg-white/90 text-gray-900 placeholder-gray-400 border-gray-300"}`}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="dob" className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Date of Birth
                  </label>
                  <DatePicker
                    selected={profile.dob}
                    onChange={handleDateChange}
                    className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${isDarkMode ? "bg-gray-700/90 text-gray-200 border-gray-600" : "bg-white/90 text-gray-900 border-gray-300"}`}
                    placeholderText="Select your date of birth"
                    required
                    wrapperClassName="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="address" className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={profile.address}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${isDarkMode ? "bg-gray-700/90 text-gray-200 placeholder-gray-500 border-gray-600" : "bg-white/90 text-gray-900 placeholder-gray-400 border-gray-300"}`}
                    required
                    placeholder="Enter your address"
                  />
                </div>

                <div>
                  <label htmlFor="ic" className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    IC Number
                  </label>
                  <input
                    type="text"
                    name="ic_number"
                    value={profile.ic_number}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${isDarkMode ? "bg-gray-700/90 text-gray-200 placeholder-gray-500 border-gray-600" : "bg-white/90 text-gray-900 placeholder-gray-400 border-gray-300"}`}
                    required
                    placeholder="Enter 12-digit IC number"
                    maxLength={12}
                    inputMode="numeric"
                  />
                  {icError && (
                    <p className={`mt-1 text-sm ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
                      {icError}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className={`cursor-pointer w-full ${isDarkMode ? "bg-blue-700 hover:bg-blue-800" : "bg-blue-600 hover:bg-blue-700"} text-white font-medium py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-200`}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx global>{`
        .react-datepicker {
          font-family: inherit;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          ${isDarkMode ? `
            background-color: #374151;
            border-color: #4b5563;
            color: #f3f4f6;
          ` : `
            background-color: white;
            border: 1px solid rgba(209, 213, 219, 0.5);
            color: #111827;
          `}
        }

        .react-datepicker__header {
          ${isDarkMode ? `
            background-color: #4b5563;
            border-bottom-color: #6b7280;
          ` : `
            background-color: #f9fafb;
            border-bottom: 1px solid #e5e7eb;
          `}
        }

        .react-datepicker__current-month,
        .react-datepicker__day-name,
        .react-datepicker__day {
          color: inherit;
        }

        .react-datepicker__day:hover {
          ${isDarkMode ? `
            background-color: #6b7280;
          ` : `
            background-color: #e5e7eb;
          `}
        }

        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected {
          background-color: #3b82f6;
          color: white;
        }

        .react-datepicker__navigation-icon::before {
          ${isDarkMode ? `
            border-color: #9ca3af;
          ` : `
            border-color: #6b7280;
          `}
        }

        .react-datepicker-popper[data-placement^=bottom] .react-datepicker__triangle::before {
          ${isDarkMode ? `
            border-bottom-color: #4b5563;
          ` : `
            border-bottom-color: #e5e7eb;
          `}
        }
      `}</style>
    </div>
  );
}