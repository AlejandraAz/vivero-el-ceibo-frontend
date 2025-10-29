
import React from "react";
import { X } from "lucide-react";

const ConfirmModal = ({ open, onClose, onConfirm, title, message }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center "
      style={{ backgroundColor: "rgba(240, 231, 221, 0.6)" }}
    >
      <div
        className="relative max-w-md w-full p-6 mx-4 rounded-lg shadow-lg"
        style={{ backgroundColor: "#e9cbb0" }}
      >
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 cursor-pointer"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-green-800 mb-4">{title}</h2>
        <p className="text-gray-700 mb-6">{message}</p>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded hover:bg-gray-400 text-gray-700 cursor-pointer"
            style={{ backgroundColor: "#F0EFEB" }}
          >
            Cancelar
          </button>

          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-white font-semibold rounded hover:bg-green-700 cursor-pointer"
            style={{ backgroundColor: "#6A994E" }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
