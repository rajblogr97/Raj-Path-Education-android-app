import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, CloseIcon } from './IconComponents';

interface ToastProps {
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 2500); // Start exit animation before it disappears

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 500); // Match animation duration
  };

  return (
    <div
      className={`fixed bottom-5 right-5 w-full max-w-sm bg-royal-blue text-white rounded-lg shadow-lg flex items-center p-4 z-50 ${
        isExiting ? 'animate-toast-out' : 'animate-toast-in'
      }`}
    >
      <CheckCircleIcon className="w-6 h-6 text-gold-accent mr-3" />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button onClick={handleClose} className="ml-4 p-1 rounded-full hover:bg-white/20">
        <CloseIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Toast;
