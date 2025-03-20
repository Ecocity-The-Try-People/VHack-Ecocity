import React, {userState, useState} from "react";
import styles from "../../Styles.jsx";

const UserProfile = () => {
    // State to manage form data
    const [profile, setProfile] = useState({
      name: "",
      dob: "",
      address: "",
      ic: "",
      profilePicture: "", // Base64 string for the profile picture
    });
  
    // State to manage edit mode for profile picture
    const [isEditingPicture, setIsEditingPicture] = useState(false);
  
    // Handle input changes
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setProfile({
        ...profile,
        [name]: value,
      });
    };
  
    // Handle profile picture change
    const handleProfilePictureChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfile({
            ...profile,
            profilePicture: reader.result, // Store base64 string
          });
        };
        reader.readAsDataURL(file); // Convert file to base64
      }
    };
  
    // Toggle edit mode for profile picture
    const toggleEditPicture = () => {
      setIsEditingPicture(!isEditingPicture);
    };
  
    // Handle form submission
    const handleSubmit = (e) => {
      e.preventDefault();
      alert("Profile updated successfully!");
      setIsEditingPicture(false);
    };
  
    return (
      <div style={styles.container}>
        <h1>User Profile</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Profile Picture */}
          <div style={styles.profilePictureContainer}>
            <img
              src={
                profile.profilePicture ||
                "https://via.placeholder.com/150" // Default placeholder image
              }
              alt="Profile"
              style={styles.profilePicture}
            />
            {isEditingPicture && (
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                style={styles.fileInput}
              />
            )}
            <button
              type="button"
              onClick={toggleEditPicture}
              style={styles.editPictureButton}
            >
              {isEditingPicture ? "Cancel" : "Change Picture"}
            </button>
          </div>
  
          {/* Name Field */}
          <div style={styles.formGroup}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
  
          {/* Date of Birth Field */}
          <div style={styles.formGroup}>
            <label>Date of Birth:</label>
            <input
              type="date"
              name="dob"
              value={profile.dob}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
  
          {/* Address Field */}
          <div style={styles.formGroup}>
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={profile.address}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
  
          {/* IC Number Field */}
          <div style={styles.formGroup}>
            <label>IC Number:</label>
            <input
              type="text"
              name="ic"
              value={profile.ic}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
  
          {/* Save Button */}
          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.button}>
              Save
            </button>
          </div>
        </form>
      </div>
    );
  };


export default UserProfile;