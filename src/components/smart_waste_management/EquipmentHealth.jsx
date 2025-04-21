import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, Wrench, CheckCircle } from 'lucide-react';
import useDarkMode from '../../hooks/DarkMode';

const EquipmentHealth = () => {
  const isDarkMode = useDarkMode();
  const [equipment, setEquipment] = useState([
    { id: 1, name: "Compactor #7", health: 88, lastService: "14 days ago", status: "normal" },
    { id: 2, name: "Truck #12", health: 62, lastService: "42 days ago", status: "warning" },
    { id: 3, name: "Sensor Node A3", health: 95, lastService: "7 days ago", status: "normal" }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEquipment(prev => prev.map(item => ({
        ...item,
        health: Math.max(10, item.health - (Math.random() * 0.5)),
        status: item.health < 60 ? "critical" : item.health < 80 ? "warning" : "normal"
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "critical":
        return <AlertTriangle className="text-red-500 mr-2" size={18} />;
      case "warning":
        return <AlertTriangle className="text-amber-500 mr-2" size={18} />;
      default:
        return <CheckCircle className="text-green-500 mr-2" size={18} />;
    }
  };

  const getHealthColorClass = (health) => {
    if (health > 80) return { text: 'text-green-600', bg: 'bg-green-500' };
    if (health > 60) return { text: 'text-amber-500', bg: 'bg-amber-500' };
    return { text: 'text-red-600', bg: 'bg-red-500' };
  };

  return (
    <div className="space-y-4">
      {equipment.map(item => {
        const colors = getHealthColorClass(item.health);
        
        return (
          <div 
            key={item.id} 
            className={`p-4 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600' 
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {getStatusIcon(item.status)}
                <span className={isDarkMode ? 'text-gray-100' : 'text-gray-800'}>
                  {item.name}
                </span>
              </div>
              <span className={`font-bold ${colors.text}`}>
                {item.health.toFixed(0)}%
              </span>
            </div>
            
            <div className={`w-full rounded-full h-2 mt-2 ${
              isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
            }`}>
              <div 
                className={`h-2 rounded-full ${colors.bg}`} 
                style={{ width: `${item.health}%` }}
              ></div>
            </div>
            
            <div className={`flex justify-between mt-2 text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-500'
            }`}>
              <span>Last service: {item.lastService}</span>
              {item.health < 80 && (
                <button className={`flex items-center ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  <Wrench className="mr-1" size={14} />
                  Schedule Maintenance
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EquipmentHealth;