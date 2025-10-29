import { useState, useEffect, useRef } from "react";
import { Rating } from "@mui/material";
import api from "../../Services/Api.js";
import { ArrowLeft, ArrowRight } from "lucide-react";

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const res = await api.get("/reviews/my-reviews");
        setReviews(res.data.reviews);
      } catch (err) {
        console.log("Error al cargar reseñas del usuario:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserReviews();
  }, []);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  if (loading)
    return <p className="text-center text-gray-600 mt-4">Cargando reseñas...</p>;

  if (reviews.length === 0)
    return (
      <div className="text-center bg-white p-6 rounded-xl shadow-md mt-4">
        <p className="text-gray-700">Todavía no realizaste ninguna reseña 🌱</p>
      </div>
    );

  return (
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg mt-6 relative">
      <h3 className="text-lg sm:text-xl font-bold text-green-700 mb-4">
        Mis reseñas ({reviews.length})
      </h3>

      <div className="relative group">
        {/* Botón izquierda */}
        <button
          onClick={scrollLeft}
          className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 bg-green-600 bg-opacity-60 text-white p-2 rounded-full shadow-lg hover:bg-opacity-90 transition opacity-0 group-hover:opacity-100"
        >
          <ArrowLeft size={24} />
        </button>

        {/* Contenedor de slides */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 scroll-smooth py-2"
        >
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-green-50 p-4 rounded-xl shadow hover:shadow-lg transition flex-shrink-0 w-72 flex flex-col"
            >
              {/* Producto */}
              <div className="flex items-center gap-3 mb-3">
                {review.product?.mainImage ? (
                  <img
                    src={review.product.mainImage}
                    alt={review.product.name}
                    className="w-12 h-12 rounded object-cover shadow"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-300 rounded flex items-center justify-center">
                    <span className="text-gray-500">📦</span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-800 text-sm sm:text-base break-words leading-tight">
                    {review.product?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(review.fecha_creacion).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Estrellas */}
              <Rating
                value={review.ratings}
                readOnly
                size="small"
                precision={0.5}
              />

              {/* Comentario */}
              <p className="text-gray-700 text-sm mt-2 flex-1">
                {review.comment.length > 150
                  ? review.comment.slice(0, 150) + "..."
                  : review.comment}
              </p>
            </div>
          ))}
        </div>

        {/* Botón derecha */}
        <button
          onClick={scrollRight}
          className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 bg-green-600 bg-opacity-60 text-white p-2 rounded-full shadow-lg hover:bg-opacity-90 transition opacity-0 group-hover:opacity-100"
        >
          <ArrowRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default UserReviews;
