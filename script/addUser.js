// src/components/AddProfile.jsx
import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function AddProfile() {
  const [formData, setFormData] = useState({
    address: "",
    date_of_birth: "",
    ic: "",
    name: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await setDoc(doc(db, "smart_city", "profile"), {
        ...formData,
        createdAt: new Date()
      });
      alert("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile: ", error);
      alert("Error saving profile!");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Full Name"
        required
      />
      <input
        name="ic"
        value={formData.ic}
        onChange={handleChange}
        placeholder="IC Number"
        required
      />
      <input
        type="date"
        name="date_of_birth"
        value={formData.date_of_birth}
        onChange={handleChange}
        required
      />
      <input
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Address"
        required
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        required
      />
      <button type="submit">Save Profile</button>
    </form>
  );
}