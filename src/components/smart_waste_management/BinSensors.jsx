import React, { useState, useEffect } from 'react';
import { Gauge, Droplet, Battery, AlertCircle, MapPin, Trash2 } from 'lucide-react';
import useDarkMode from '../../hooks/DarkMode';
import { db } from '../../../config/firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { useNotificationContext } from '../../context/NotificationContext';
import { AnimatePresence, motion } from 'framer-motion';

const MALAYSIA_TEMP = {
  MIN: 23,   
  MAX: 36    
};

const BinSensors = ({ onUpdate, onReplaceBattery, onClearBin }) => {
  const [showBatteryModal, setShowBatteryModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [currentBinId, setCurrentBinId] = useState(null);
  const isDarkMode = useDarkMode();
  const { showNotification } = useNotificationContext();
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState({});

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'bins'),
      (snapshot) => {
        const binsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBins(binsData);
        onUpdate(binsData);
        setLoading(false);
      },
      (err) => {
        setError("Failed to fetch bin data");
        setLoading(false);
        showNotification("Error fetching bin data", "error");
      }
    );
    return () => unsubscribe();
  }, [onUpdate, showNotification]);

  useEffect(() => {
    if (bins.length === 0) return;

    const interval = setInterval(() => {
      bins.forEach(async (bin) => {
        const updatedData = {
          fillLevel: clampValue(
            bin.fillLevel + (Math.random() * 5 - 2),
            0,    
            100   
          ),
          temperature: clampValue(
            bin.temperature + (Math.random() - 0.5),
            MALAYSIA_TEMP.MIN,
            MALAYSIA_TEMP.MAX
          ),
          battery: clampValue(bin.battery - 0.1, 10, 100),
          lastUpdated: new Date()
        };

        try {
          await updateDoc(doc(db, 'bins', bin.id), updatedData);
        } catch (err) {
          console.error("Failed to update bin:", err);
        }
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [bins]);

  const handleReplaceBattery = async () => {
    if (!currentBinId) return;
    
    try {
      setProcessing(prev => ({ ...prev, [currentBinId]: 'battery' }));
      
      await updateDoc(doc(db, 'bins', currentBinId), { 
        battery: 100,
        lastBatteryReplacement: new Date() 
      });
      
      onReplaceBattery(currentBinId);
      showNotification("Battery replaced successfully!", "success");
      setShowBatteryModal(false);
    } catch (error) {
      console.error("Battery replacement failed:", error);
      showNotification("Failed to replace battery", "error");
    } finally {
      setProcessing(prev => ({ ...prev, [currentBinId]: null }));
    }
  };

  const handleClearBin = async () => {
    if (!currentBinId) return;
    
    try {
      setProcessing(prev => ({ ...prev, [currentBinId]: 'clear' }));
      
      await updateDoc(doc(db, 'bins', currentBinId), { 
        fillLevel: 0,
        lastCleared: new Date() 
      });
      
      onClearBin(currentBinId);
      showNotification("Bin cleared successfully!", "success");
      setShowClearModal(false);
    } catch (error) {
      console.error("Bin clearing failed:", error);
      showNotification("Failed to clear bin", "error");
    } finally {
      setProcessing(prev => ({ ...prev, [currentBinId]: null }));
    }
  };

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
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bins.map((bin) => (
          <div 
            key={bin.id}
            className={`p-4 rounded-lg border-2 transition-colors duration-200 ${
              getBinStyles(bin.fillLevel).border
            } ${getBinStyles(bin.fillLevel).bg}`}
          >
            <h3 className="font-bold flex justify-between">
              <span className={`flex items-center ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                <MapPin className={`mr-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} size={16} />
                {bin.location}
              </span>
              <span className={`text-xs font-normal flex items-center ${
                bin.battery < 20 ? 'text-red-500' : isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <Battery className="mr-1" size={14} />
                {bin.battery?.toFixed(0) ?? 'N/A'}%
              </span>
            </h3>

            <div className="mt-3 space-y-2">
              <div className="flex items-center">
                <Gauge className={`mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} size={16} />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Fill Level: </span>
                <span className={`font-bold ml-auto ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  {bin.fillLevel?.toFixed(0) ?? 'N/A'}%
                </span>
              </div>

              <div className="flex items-center">
                <Droplet className={`mr-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} size={16} />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Temperature: </span>
                <span className={`font-bold ml-auto ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  {bin.temperature?.toFixed(1) ?? 'N/A'}°C
                </span>
              </div>

              {bin.fillLevel > 85 && (
                <div className={`flex items-center text-sm ${getBinStyles(bin.fillLevel).text}`}>
                  <AlertCircle className="mr-1" size={14} />
                  <span>Needs Immediate Collection</span>
                </div>
              )}
            </div>

            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => {
                  setCurrentBinId(bin.id);
                  setShowBatteryModal(true);
                }}
                disabled={processing[bin.id] === 'battery'}
                className={`relative flex items-center justify-center 
                  px-4 py-2 rounded-lg text-sm font-medium
                  transition-all duration-200 ease-out
                  shadow-sm hover:shadow-md
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                  ${
                    processing[bin.id] === 'battery'
                      ? 'bg-blue-400 cursor-not-allowed shadow-inner'
                      : 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                  } text-white`}
              >
                {processing[bin.id] === 'battery' ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Replacing...
                  </>
                ) : (
                  <>
                    <Battery className="w-4 h-4 mr-2" />
                    Replace Battery
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setCurrentBinId(bin.id);
                  setShowClearModal(true);
                }}
                disabled={processing[bin.id] === 'clear'}
                className={`relative flex items-center justify-center 
                  px-4 py-2 rounded-lg text-sm font-medium
                  transition-all duration-200 ease-out
                  shadow-sm hover:shadow-md
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                  ${
                    processing[bin.id] === 'clear'
                      ? 'bg-green-400 cursor-not-allowed shadow-inner'
                      : 'bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                  } text-white`}
              >
                {processing[bin.id] === 'clear' ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Clearing...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Bin
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Battery Replacement Modal */}
      <AnimatePresence>
        {showBatteryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
              onClick={() => setShowBatteryModal(false)}
            />

            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />

              <div className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 mb-4 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                    <Battery className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Replace Battery?
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Are you sure you want to replace the battery for this bin? 
                    This will reset the battery level to 100%.
                  </p>

                  <div className="flex w-full gap-3">
                    <button
                      onClick={() => setShowBatteryModal(false)}
                      disabled={processing[currentBinId] === 'battery'}
                      className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                        border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 
                        hover:bg-gray-50 dark:hover:bg-gray-700/50 disabled:opacity-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReplaceBattery}
                      disabled={processing[currentBinId] === 'battery'}
                      className="flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-all duration-200
                        bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600
                        shadow-md hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {processing[currentBinId] === 'battery' ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Replacing...
                        </>
                      ) : (
                        <>
                          <Battery className="w-4 h-4" />
                          Replace Battery
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clear Bin Modal */}
      <AnimatePresence>
        {showClearModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
              onClick={() => setShowClearModal(false)}
            />

            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500" />

              <div className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 mb-4 bg-green-100 dark:bg-green-900/20 rounded-full">
                    <Trash2 className="w-8 h-8 text-green-500 dark:text-green-400" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Clear Bin?
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Are you sure you want to clear this bin? 
                    This will reset the fill level to 0%.
                  </p>

                  <div className="flex w-full gap-3">
                    <button
                      onClick={() => setShowClearModal(false)}
                      disabled={processing[currentBinId] === 'clear'}
                      className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                        border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 
                        hover:bg-gray-50 dark:hover:bg-gray-700/50 disabled:opacity-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleClearBin}
                      disabled={processing[currentBinId] === 'clear'}
                      className="flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-all duration-200
                        bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600
                        shadow-md hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {processing[currentBinId] === 'clear' ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Clearing...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                          Clear Bin
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

function clampValue(value, min, max, decimals = 2) {
  const clamped = Math.min(max, Math.max(min, value));
  return parseFloat(clamped.toFixed(decimals));
}

export default BinSensors;