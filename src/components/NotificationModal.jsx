import { useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info,
  X,
  Trash2,
  Archive,
  ArchiveRestore
} from 'lucide-react';

export default function NotificationModal({ notification, onClose }) {
  if (!notification) return null;

  const { type, title, message, onConfirm, onCancel, showCancel } = notification;

  const config = {
    success: {
      icon: <CheckCircle className="w-12 h-12 text-green-500" />,
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-800",
      button: "bg-green-600 hover:bg-green-700",
      title: title || "Success!",
    },
    error: {
      icon: <XCircle className="w-12 h-12 text-red-500" />,
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      button: "bg-red-600 hover:bg-red-700",
      title: title || "Error!",
    },
    confirm: {
      icon: <AlertTriangle className="w-12 h-12 text-yellow-500" />,
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-800",
      button: "bg-yellow-600 hover:bg-yellow-700",
      title: title || "Confirm Action",
    },
    info: {
      icon: <Info className="w-12 h-12 text-blue-500" />,
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
      button: "bg-blue-600 hover:bg-blue-700",
      title: title || "Information",
    },
  };

  const { icon, bg, border, text, button, title: configTitle } = config[type] || config.info;

  // Auto-hide success and info notifications after 3 seconds
  useEffect(() => {
    if (type === 'success' || type === 'info') {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [type, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div 
        className={`bg-white rounded-2xl shadow-2xl border-2 ${border} max-w-md w-full transform transition-all duration-300 ease-out scale-100 opacity-100`}
        style={{
          animation: 'notificationSlideIn 0.3s ease-out'
        }}
      >
        {/* Header */}
        <div className={`${bg} px-6 py-4 rounded-t-2xl flex items-center justify-between`}>
          <div className="flex items-center space-x-3">
            {icon}
            <h3 className={`text-xl font-bold ${text}`}>{configTitle}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-gray-700 text-base leading-relaxed mb-6">
            {message}
          </p>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {showCancel && (
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors duration-200"
              >
                Cancel
              </button>
            )}
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-3 rounded-xl font-medium text-white transition-colors duration-200 ${button}`}
            >
              {showCancel ? 'Confirm' : 'OK'}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes notificationSlideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
