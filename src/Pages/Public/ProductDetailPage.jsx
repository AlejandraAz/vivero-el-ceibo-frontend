import ReviewCarousel from "../Public/ReviewCarrousel.jsx";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../Services/Api.js";
import { Rating, Box } from "@mui/material";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "../../css/App.css";
import {useCart} from "../../context/CartContext.jsx";
import CreateReviewForm from "../Customer/CreateReviewForm.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { X } from "lucide-react";
import BotonVolver from "../../Components/BotonVolver.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();

  // Cargar producto
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        const prod = res.data.product;
        setProduct(prod);
        const mainImg =
          prod.images?.find((img) => img.is_main)?.url ||
          prod.images?.[0]?.url ||
          "/placeholder.jpg";
        setMainImage(mainImg);
      } catch (err) {
        console.error("Error al obtener producto:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Cargar reseñas
  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/product/${id}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Error al obtener reseñas:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  const handleQuantityChange = (type) => {
    setQuantity((prev) => {
      if (type === "decrement" && prev > 1) return prev - 1;
      if (type === "increment" && prev < product.stock) return prev + 1;
      return prev;
    });
  };

  const handleAddToCart = async () => {
  if (!product) return;

  try {
    setIsAdding(true); // muestra el loader
    await addItem({ id_product: product.id, quantity });
  } catch (err) {
    console.error("Error al agregar al carrito:", err);
  } finally {
    setIsAdding(false); // oculta el loader
  }
};

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <p className="text-red-500 font-bold text-center mt-10 text-lg">
        Producto no encontrado
      </p>
    );
  }

  return (
    <>
    <div className="p-4">
      <BotonVolver />
    </div>
    <div className="max-w-7xl mx-auto my-10 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Imagen principal + thumbnails */}
        <div className="flex flex-col">
          <div className="overflow-hidden rounded">
            <Zoom zoomMargin={50}>
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-[400px] object-contain rounded"
              />
            </Zoom>
          </div>
          <div className="flex gap-2 mt-4 justify-center">
            {product.images?.map((img, i) => (
              <div
                key={i}
                className={`w-16 h-16 overflow-hidden rounded border cursor-pointer ${
                  mainImage === img.url ? "border-green-600" : "border-gray-300"
                }`}
                onClick={() => setMainImage(img.url)}
              >
                <img
                  src={img.url}
                  alt={`thumb-${i}`}
                  className="w-full h-full object-cover"
                  style={{ width: "64px", height: "64px" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Info del producto */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold">{product.name}</h1>
            {product.category && (
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium shadow"
                style={{ backgroundColor: "#B08968", color: "#4B2E2E" }}
              >
                {product.category.name}
              </span>
            )}
          </div>

          <p className="text-3xl font-extrabold text-green-600 mb-4">
            ${product.price}
          </p>

          {/* ⭐ Valoración promedio */}
          {reviews.length > 0 && (
            <Box display="flex" alignItems="center" gap={1} mb={3}>
              <Rating
                value={
                  reviews.reduce((sum, r) => sum + Number(r.ratings || 0), 0) /
                  reviews.length
                }
                readOnly
                precision={0.5}
                size="medium"
              />
              <p className="text-sm text-gray-600">
                ({reviews.length} reseña{reviews.length > 1 ? "s" : ""})
              </p>
            </Box>
          )}

          <div
            className="prose prose-green max-w-none mb-4 list-disc list-inside"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />

          <p className="text-sm text-gray-500 mb-4">
            Stock disponible: {product.stock}
          </p>

          {/* Cantidad y agregar al carrito */}
          <div className=" flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="flex items-center border rounded">
              <button
                onClick={() => handleQuantityChange("decrement")}
                className="px-3 py-1 text-lg hover:bg-gray-100"
              >
                -
              </button>
              <input
                type="number"
                readOnly
                value={quantity}
                className="w-12 text-center border-x border-gray-300 focus:outline-none"
              />
              <button
                onClick={() => handleQuantityChange("increment")}
                className="px-3 py-1 text-lg hover:bg-gray-100"
              >
                +
              </button>
            </div>
            <button
  onClick={handleAddToCart}
  disabled={isAdding}
  className={`bg-green-600 hover:bg-green-700 cursor-pointer text-white font-medium py-2 px-6 rounded transition flex items-center justify-center gap-2 ${
    isAdding ? "opacity-70 cursor-pointer" : ""
  }`}
>
   {isAdding ? (
    <>
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      <span>Agregando...</span>
    </>
  ) : (
    "Agregar al carrito"
  )}
</button>

          </div>
        </div>
      </div>

      {/* Reseñas */}
      <div className="mt-10">
        <div className="mt-4 flex items-center text-[#835D3C]">
          <hr className="flex-grow border-t-2  border-[#B08968]" />
          <span className="mx-4 font-semibold text-2xl">Opiniones</span>
          <hr className="flex-grow border-t-2 border-[#B08968]" />
        </div>
        <ReviewCarousel reviews={reviews} />

        {/* Botón Crear Reseña solo si el usuario está logueado */}
        {user && user.rol === "cliente" && (
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition text-sm sm:text-base"
            >
              + Agregar reseña
            </button>
          </div>
        )}
      </div>

      {/* Modal Crear Reseña */}
      {isReviewModalOpen && user && (
        <div className="fixed inset-0 bg-gray-300 bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg relative w-full max-w-lg">
            <button
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <CreateReviewForm
              productId={product.id} // <--- importante
              onClose={() => setIsReviewModalOpen(false)}
              onReviewCreated={fetchReviews} // <--- recarga reseñas
            />
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
    </>
  );
};

export default ProductDetailPage;
