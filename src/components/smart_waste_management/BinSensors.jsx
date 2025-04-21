import React, { useState, useEffect } from 'react';
import { Gauge, Droplet, Battery, AlertCircle, MapPin } from 'lucide-react';
import useDarkMode from '../../hooks/DarkMode';
import { db } from '../../../config/firebase'; // Import Firebase
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';

const BinSensors = ({ onUpdate }) => {
  const isDarkMode = useDarkMode();
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ===== (1) FETCH REAL-TIME DATA FROM FIRESTORE =====
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'bins'),
      (snapshot) => {
        const binsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBins(binsData);
        onUpdate(binsData); // Notify parent component
        setLoading(false);
      },
      (err) => {
        setError("Failed to fetch bin data");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [onUpdate]);

  // ===== (2) SIMULATE UPDATES (FOR DEMO) =====
  // (Optional: Replace with real sensor updates)
  useEffect(() => {
    if (bins.length === 0) return;

    const interval = setInterval(() => {
      bins.forEach(async (bin) => {
        const updatedData = {
          fillLevel: parseFloat(Math.min(100, bin.fillLevel + (Math.random() * 5 - 2)).toFixed(2)),
          temperature: bin.temperature + (Math.random() - 0.5),
          battery: Math.max(10, bin.battery - 0.1),
        };

        // Update Firestore
        try {
          await updateDoc(doc(db, 'bins', bin.id), updatedData);
        } catch (err) {
          console.error("Failed to update bin:", err);
        }
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [bins]);

  // ===== (3) STYLING HELPER =====
  const getBinStyles = (fillLevel) => {
    if (fillLevel > 85) {
      return {
        border: 'border-red-500',
        bg: isDarkMode ? 'bg-red-900/20' : 'bg-red-50',
        text: isDarkMode ? 'text-red-400' : 'text-red-600'
      };
    } else if (fillLevel > 60) {
      return {
        border: 'border-amber-500',
        bg: isDarkMode ? 'bg-amber-900/20' : 'bg-amber-50',
        text: isDarkMode ? 'text-amber-400' : 'text-amber-600'
      };
    } else {
      return {
        border: 'border-green-500',
        bg: isDarkMode ? 'bg-green-900/20' : 'bg-green-50',
        text: isDarkMode ? 'text-green-400' : 'text-green-600'
      };
    }
  };

  if (loading) return <div className="text-center py-4">Loading bins...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;
  if (bins.length === 0) return <div className="text-center py-4">No bins found.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {bins.map((bin) => (
        <BinCard 
          key={bin.id} 
          bin={bin} 
          isDarkMode={isDarkMode} 
          styles={getBinStyles(bin.fillLevel)} 
        />
      ))}
    </div>
  );
};

// ===== (4) EXTRACTED BIN CARD COMPONENT =====
const BinCard = ({ bin, isDarkMode, styles }) => (
  <div className={`p-4 rounded-lg border-2 transition-colors duration-200 ${styles.border} ${styles.bg}`}>
    <h3 className="font-bold flex justify-between">
      <span className={`flex items-center ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
        <MapPin className={`mr-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} size={16} />
        {bin.location}
      </span>
      <span className={`text-xs font-normal flex items-center ${
        bin.battery < 20 ? 'text-red-500' : isDarkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        <Battery className="mr-1" size={14} />
        {bin.battery.toFixed(0)}%
      </span>
    </h3>

    <div className="mt-3 space-y-2">
      <div className="flex items-center">
        <Gauge className={`mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} size={16} />
        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Fill Level: </span>
        <span className={`font-bold ml-auto ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          {bin.fillLevel.toFixed(0)}%
        </span>
      </div>

      <div className="flex items-center">
        <Droplet className={`mr-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} size={16} />
        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Temperature: </span>
        <span className={`font-bold ml-auto ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          {bin.temperature.toFixed(1)}°C
        </span>
      </div>

      {bin.fillLevel > 85 && (
        <div className={`flex items-center text-sm ${styles.text}`}>
          <AlertCircle className="mr-1" size={14} />
          <span>Needs Immediate Collection</span>
        </div>
      )}
    </div>
  </div>
);

export default BinSensors;