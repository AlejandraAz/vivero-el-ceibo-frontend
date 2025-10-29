import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Rating, Box } from "@mui/material";

const ReviewCard = ({ review }) => {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 150;

  const toggleExpand = () => setExpanded(!expanded);

  const displayText =
    review.comment.length > maxLength && !expanded
      ? review.comment.slice(0, maxLength) + "..."
      : review.comment;

  return (
    <div className="bg-green-50 p-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col w-80 min-h-[18rem]">
      {/* Usuario */}
      <div className="flex items-center gap-3 mb-2">
        {review.customer?.photo ? (
          <img
            src={review.customer.photo}
            alt={review.customer.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500 font-bold">U</span>
          </div>
        )}
        <div>
          <p className="font-semibold">{review.customer?.name || "Usuario Anónimo"}</p>
          <p className="text-sm text-gray-500">
            {new Date(review.fecha_creacion).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Estrellas */}
      <Box display="flex" alignItems="center" gap={0.5} mb={2}>
        <Rating value={review.ratings} readOnly size="small" precision={0.5} />
      </Box>

      {/* Comentario */}
      <div className="flex-1 mb-2 overflow-hidden">
        <p className="text-gray-700">{displayText}</p>
      </div>

      {review.comment.length > maxLength && (
        <button
          onClick={toggleExpand}
          className="text-green-600 text-sm font-medium mt-auto self-start"
        >
          {expanded ? "Leer menos" : "Leer más"}
        </button>
      )}
    </div>
  );
};

const ReviewCarousel = ({ reviews }) => {
  const [index, setIndex] = useState(0);
  const visibleCards = 3; // cantidad de cards visibles

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center p-6 bg-white rounded shadow">
        No hay reseñas para este producto
      </div>
    );
  }

  const total = reviews.length;

  const prevSlide = () => setIndex((prev) => Math.max(prev - 1, 0));
  const nextSlide = () => setIndex((prev) => Math.min(prev + 1, total - visibleCards));

  const getVisibleReviews = () => {
    // Evita duplicar cards si hay menos que visibleCards
    return reviews.slice(index, index + visibleCards);
  };

  return (
    <div className="relative w-full flex flex-col items-center">
      <div className="flex gap-4 p-5 overflow-hidden justify-center">
        {getVisibleReviews().map((review, i) => (
          <ReviewCard key={`${review.id}-${i}`} review={review} />
        ))}
      </div>

      {/* Flechas */}
      {index > 0 && (
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100"
        >
          <ChevronLeft size={24} />
        </button>
      )}
      {index + visibleCards < total && (
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100"
        >
          <ChevronRight size={24} />
        </button>
      )}
    </div>
  );
};

export default ReviewCarousel;
