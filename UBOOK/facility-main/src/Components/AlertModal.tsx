import React from "react";

interface AlertModalProps {
  open: boolean;
  message: string;
  onClose: () => void;
  type?: "success" | "error";
}

const AlertModal: React.FC<AlertModalProps> = ({ open, message, onClose, type = "success" }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className={`bg-gray-900 rounded-xl p-6 max-w-sm w-full shadow-lg relative border-2 ${type === "error" ? "border-red-500" : "border-green-500"}`}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl"
          aria-label="Close"
        >
          &times;
        </button>
        <div className={`mb-4 text-center text-2xl ${type === "error" ? "text-red-400" : "text-green-400"}`}>
          {type === "error" ? "⚠️" : "✅"}
        </div>
        <div className="text-white text-center">{message}</div>
      </div>
    </div>
  );
};

export default AlertModal;