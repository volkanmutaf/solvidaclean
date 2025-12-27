// components/CustomAlertDialog.jsx

import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export default function CustomAlertDialog({
  message,
  type = "info",
  onConfirm,
  onCancel,
  showCancel = false,
}) {
  const config = {
    success: {
      icon: <CheckCircle className="w-8 h-8 text-green-500" />,
      bg: "bg-green-50",
      text: "text-green-800",
      title: "Success!",
    },
    error: {
      icon: <XCircle className="w-8 h-8 text-red-500" />,
      bg: "bg-red-50",
      text: "text-red-800",
      title: "Error!",
    },
    confirm: {
      icon: <AlertTriangle className="w-8 h-8 text-yellow-500" />,
      bg: "bg-yellow-50",
      text: "text-yellow-800",
      title: "Confirm Action",
    },
    info: {
      icon: <AlertTriangle className="w-8 h-8 text-blue-500" />,
      bg: "bg-blue-50",
      text: "text-blue-800",
      title: "Information",
    },
  };

  const { icon, bg, text, title } = config[type] || config.info;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100]">
      <div className={`bg-white rounded-lg shadow-2xl p-6 max-w-sm w-full ${bg}`}>
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">{icon}</div>
          <h3 className={`text-lg font-bold mb-2 ${text}`}>{title}</h3>
          <p className="text-gray-700 mb-6">{message}</p>
          <div className="flex space-x-3 w-full">
            {showCancel && (
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
            )}
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2 rounded-md font-semibold text-white ${
                type === "error"
                  ? "bg-red-600 hover:bg-red-700"
                  : type === "success"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {showCancel ? "Confirm" : "OK"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
