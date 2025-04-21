// src/components/BinCard.jsx
import React from 'react';
import { Gauge, Droplet, Battery, AlertCircle, MapPin } from 'lucide-react';

const BIN_STATUS = {
  HIGH: {
    threshold: 85,
    border: 'border-red-500',
    bg: { dark: 'bg-red-900/20', light: 'bg-red-50' },
    text: { dark: 'text-red-400', light: 'text-red-600' },
    message: 'Needs Immediate Collection'
  },
  MEDIUM: {
    threshold: 60,
    border: 'border-amber-500',
    bg: { dark: 'bg-amber-900/20', light: 'bg-amber-50' },
    text: { dark: 'text-amber-400', light: 'text-amber-600' },
    message: 'Approaching Full'
  },
  LOW: {
    threshold: 0,
    border: 'border-green-500',
    bg: { dark: 'bg-green-900/20', light: 'bg-green-50' },
    text: { dark: 'text-green-400', light: 'text-green-600' },
    message: 'Adequate Capacity'
  }
};

const BinCard = React.memo(({ bin, isDarkMode }) => {
  const status = React.useMemo(() => {
    if (bin.fillLevel > BIN_STATUS.HIGH.threshold) return BIN_STATUS.HIGH;
    if (bin.fillLevel > BIN_STATUS.MEDIUM.threshold) return BIN_STATUS.MEDIUM;
    return BIN_STATUS.LOW;
  }, [bin.fillLevel]);

  return (
    <div
      className={`p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-lg ${
        status.border
      } ${isDarkMode ? status.bg.dark : status.bg.light}`}
    >
      <h3 className="font-bold flex justify-between items-center">
        <span className={`flex items-center ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          <MapPin className={`mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} size={18} />
          {bin.location}
        </span>
        <span
          className={`text-xs px-2 py-1 rounded-full flex items-center ${
            bin.battery < 20
              ? 'bg-red-500 text-white'
              : isDarkMode
              ? 'bg-gray-700 text-gray-300'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          <Battery className="mr-1" size={14} />
          {bin.battery.toFixed(0)}%
        </span>
      </h3>

      <div className="mt-4 space-y-3">
        <div className="flex items-center">
          <Gauge className={`mr-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} size={18} />
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Fill Level</span>
              <span className={`font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                {bin.fillLevel.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className={`h-2.5 rounded-full ${
                  isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
                }`}
                style={{ width: `${bin.fillLevel}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <Droplet className={`mr-3 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} size={18} />
          <div className="flex-1">
            <div className="flex justify-between text-sm">
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Temperature</span>
              <span className={`font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                {bin.temperature.toFixed(1)}°C
              </span>
            </div>
          </div>
        </div>

        <div
          className={`flex items-center text-sm p-2 rounded ${
            isDarkMode ? status.text.dark : status.text.light
          } ${isDarkMode ? 'bg-opacity-20' : 'bg-opacity-30'} ${
            isDarkMode ? 'bg-red-900' : 'bg-red-100'
          }`}
        >
          <AlertCircle className="mr-2" size={16} />
          <span>{status.message}</span>
        </div>
      </div>
    </div>
  );
});

export default BinCard;