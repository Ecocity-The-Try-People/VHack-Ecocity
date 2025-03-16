import { motion } from 'framer-motion';
import { useNotificationContext } from '../context/NotificationContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faInfoCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';

const Notification = () => {
  const { notification, hideNotification } = useNotificationContext();

  if (!notification) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return faCheckCircle;
      case 'error':
        return faExclamationCircle;
      case 'warning':
        return faExclamationCircle;
      default:
        return faInfoCircle;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="notification z-[10000] fixed top-4 right-4 p-4 rounded-lg cursor-pointer"
      onClick={hideNotification}
    >
      <div className={clsx(
        'flex items-center gap-3 p-3 rounded-lg',
        {
          'bg-red-100 text-red-800': notification.type === 'error',
          'bg-green-100 text-green-800': notification.type === 'success',
          'bg-yellow-100 text-yellow-800': notification.type === 'warning',
          'bg-blue-100 text-blue-800': notification.type === 'info',
        }
      )}>
        <FontAwesomeIcon icon={getIcon(notification.type)} className="w-5 h-5" />
        <p className="text-sm font-medium">{notification.message}</p>
      </div>
    </motion.div>
  );
};

export default Notification;
