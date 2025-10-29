import React from "react";
import { X, Trash2 } from "lucide-react";

const ImagesModal = ({ isOpen, onClose, images, deleteImage, deleteAllImages }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200 bg-opacity-60">
      <div className="bg-[#e9cbb0] rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-2 cursor-pointer right-2 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-4">Imágenes del Producto</h2>

        {images.length === 0 ? (
          <p className="text-gray-500">No hay imágenes disponibles</p>
        ) : (
          <div className="space-y-2">
            {images.map((img) => (
              <div
                key={img.id}
                className="flex items-center justify-between border p-2 rounded"
              >
                <img
                  src={img.url}
                  alt="Producto"
                  className="w-16 h-16 object-cover rounded"
                />
                <button
                  onClick={() => deleteImage(img.id)}
                  className="bg-[#8B5E3C] hover:bg-[#A65F46] p-2 rounded text-white cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" /> Eliminar
                </button>
              </div>
            ))}
          </div>
        )}

        {images.length > 0 && (
          <button
            onClick={deleteAllImages}
            className="mt-4 w-full bg-[#8B5E3C] hover:bg-[#A65F46] text-white p-2 rounded cursor-pointer"
          >
            Eliminar Todas las Imágenes
          </button>
        )}
      </div>
    </div>
  );
};

export default ImagesModal;
