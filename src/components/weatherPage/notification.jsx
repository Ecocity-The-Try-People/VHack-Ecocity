import { useState, useEffect } from 'react';
import { Bell, BellRing, X, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useDarkMode from '../../hooks/DarkMode';

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Flood Alert",
      message: "Heavy rainfall expected in Kuala Lumpur area",
      type: "alert",
      time: "10 mins ago",
      read: false,
      timestamp: new Date(Date.now() - 10 * 60 * 1000) // 10 minutes ago
    },
    {
      id: 2,
      title: "System Update",
      message: "New weather data available for your region",
      type: "info",
      time: "1 hour ago",
      read: true,
      timestamp: new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago
    },
    {
      id: 3,
      title: "Monitoring Active",
      message: "Flood sensors are functioning normally",
      type: "success",
      time: "2 hours ago",
      read: true,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    }
  ]);

  const isDarkMode = useDarkMode();
  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleNotifications = () => setIsOpen(!isOpen);
  
  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? {...n, read: true} : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({...n, read: true})));
  };

  const clearAll = () => {
    setNotifications([]);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && !e.target.closest('.notification-container')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const getIcon = (type) => {
    const iconProps = {
      className: "w-5 h-5",
      "aria-hidden": true
    };

    switch(type) {
      case 'alert': return <AlertTriangle {...iconProps} className={`${iconProps.className} text-yellow-500`} />;
      case 'info': return <Info {...iconProps} className={`${iconProps.className} text-blue-500`} />;
      case 'success': return <CheckCircle {...iconProps} className={`${iconProps.className} text-green-500`} />;
      default: return <Info {...iconProps} className={`${iconProps.className} text-gray-500`} />;
    }
  };

  const formatTime = (date) => {
    const diff = (Date.now() - date.getTime()) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="notification-container relative">
      <button
        onClick={toggleNotifications}
        className={`relative p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 group cursor-pointer ${
          isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
        }`}
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        {unreadCount > 0 ? (
          <BellRing className="w-6 h-6 text-yellow-500 animate-pulse" />
        ) : (
          <Bell className={`w-6 h-6 ${
            isDarkMode ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-600 group-hover:text-blue-500'
          }`} />
        )}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ 
              type: 'spring', 
              stiffness: 400,
              damping: 25,
              duration: 0.2
            }}
            className={`absolute right-0 mt-2 w-80 rounded-lg shadow-xl overflow-hidden z-50 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } border`}
          >
            <div className={`p-4 border-b flex justify-between items-center ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h3 className={`font-bold text-lg ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Notifications
              </h3>
              <div className="flex space-x-3">
                {notifications.some(n => !n.read) && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                  >
                    Mark All Read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button 
                    onClick={clearAll}
                    className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
                <button 
                  onClick={() => setIsOpen(false)}
                  className={`p-1 rounded-full ${
                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                  aria-label="Close notifications"
                >
                  <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                <ul className={`divide-y ${
                  isDarkMode ? 'divide-gray-700' : 'divide-gray-200'
                }`}>
                  {notifications.map((notification) => (
                    <motion.li
                      key={notification.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`p-4 cursor-pointer transition-colors ${
                        isDarkMode 
                          ? 'hover:bg-gray-700' 
                          : 'hover:bg-gray-50'
                      } ${
                        !notification.read 
                          ? isDarkMode 
                            ? 'bg-blue-900/20' 
                            : 'bg-blue-50/50' 
                          : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start">
                        <div className="mt-1 mr-3">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className={`font-medium ${
                              !notification.read 
                                ? isDarkMode 
                                  ? 'text-white' 
                                  : 'text-gray-900' 
                                : isDarkMode 
                                  ? 'text-gray-300' 
                                  : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h4>
                            <span className={`text-xs ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {formatTime(notification.timestamp)}
                            </span>
                          </div>
                          <p className={`text-sm mt-1 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <div className="p-6 text-center">
                  <Bell className={`w-8 h-8 mx-auto mb-2 ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                    No notifications available
                  </p>
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className={`p-3 border-t ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              } text-center`}>
                <button className={`text-sm cursor-pointer ${
                  isDarkMode 
                    ? 'text-blue-400 hover:text-blue-300' 
                    : 'text-blue-500 hover:text-blue-700'
                }`}>
                  View All Notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notification;