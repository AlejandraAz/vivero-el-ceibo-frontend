
import { useState } from "react";
import api from "../../Services/Api.js"; 
import { Star } from "lucide-react";
import { toast } from "react-toastify";

const CreateReviewForm = ({ productId, onClose, onReviewCreated }) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating || !comment.trim()) {
      toast.warn("Por favor completá todos los campos.");
      return;
    }

    try {
      setLoading(true);

      // Se envía exactamente lo que el backend espera
      const res = await api.post(
        "/reviews",
        {
          id_product: productId, // importante que coincida con backend
          ratings: rating,       // plural, como espera el backend
          comment: comment.trim(),
        },
        { withCredentials: true } // para enviar cookie JWT
      );

      toast.success(res.data.message || "Reseña enviada con éxito.");
      setComment("");
      setRating(0);

      // Refresca las reseñas en la página
      if (onReviewCreated) onReviewCreated();

      // Cierra el modal
      if (onClose) onClose();
    } catch (err) {
      console.error("Error al crear reseña:", err);
      const msg = err.response?.data?.message || "No se pudo enviar la reseña.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-md p-4 mt-6 border border-gray-200"
    >
      <h3 className="text-lg font-semibold mb-3 text-gray-800">
        Dejá tu reseña
      </h3>

      {/* ⭐ Selección de estrellas */}
      <div className="flex mb-3">
        {[1, 2, 3, 4, 5].map((num) => (
          <Star
            key={num}
            onClick={() => setRating(num)}
            className={`w-6 h-6 cursor-pointer ${
              num <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>

      <textarea
        className="w-full border rounded-lg p-2 focus:ring focus:ring-green-300 focus:outline-none resize-none text-sm"
        rows={4}
        placeholder="Escribí tu comentario..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button
        type="submit"
        disabled={loading}
        className="mt-3 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
      >
        {loading ? "Enviando..." : "Enviar reseña"}
      </button>
    </form>
  );
};

export default CreateReviewForm;
