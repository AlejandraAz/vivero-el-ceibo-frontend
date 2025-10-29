import { useState, useEffect } from "react";
import api from "../Services/Api.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Rating,
  Chip,
  Box,
} from "@mui/material";
import { useCart } from "../context/CartContext.jsx";

// 🔹 Helper para truncar HTML
const truncateHTML = (html, limit) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  let text = div.textContent || div.innerText || "";
  if (text.length <= limit) return html;
  text = text.substring(0, limit);
  return text + "...";
};

const FeaturedCarousel = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [addingId, setAddingId] = useState(null); // 🔹 Producto que se está agregando
  const navigate = useNavigate();
  const { addItem, loading: cartLoading } = useCart();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get("/products/featured");
        setFeaturedProducts(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (err) {
        console.error("Error al cargar productos destacados", err);
        toast.error("No se pudieron cargar los productos destacados");
      }
    };
    fetchFeatured();
  }, []);

  if (!featuredProducts.length) return null;

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 4, mb: 5, overflow: "visible" }}>
      <div className="text-center my-8">
        <h2 className="text-4xl font-bold text-[#6A994E] relative inline-block">
          Ofertas Especiales
          <span className="block h-[4px] w-40 bg-[#6A994E] mx-auto mt-3 rounded-full"></span>
        </h2>
      </div>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          0: { slidesPerView: 1 },
          600: { slidesPerView: 1.2 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
      >
        {featuredProducts.map((item) => {
          const mainImage = item.images?.find((img) => img.is_main) || item.images?.[0];
          const avgRating = item.reviews?.length
            ? item.reviews.reduce((sum, r) => sum + Number(r.ratings), 0) / item.reviews.length
            : 0;

          const isAdding = addingId === item.id;

          return (
            <SwiperSlide key={item.id} className="py-2">
              <Card
                onClick={() => navigate(`/product/${item.id}`)}
                sx={{
                  borderRadius: 2,
                  backgroundColor: "#FFF8F0",
                  boxShadow: 3,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  cursor: "pointer",
                  transition: "0.3s",
                  "&:hover": { boxShadow: 6 },
                }}
              >
                <CardMedia
                  component="img"
                  sx={{ height: 200, objectFit: "cover" }}
                  image={mainImage?.url || "/placeholder.jpg"}
                  alt={item.name}
                />

                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#6A994E" }}>
                      {item.name}
                    </Typography>
                    <Chip
                      label="Oferta"
                      size="small"
                      sx={{
                        backgroundColor: "#B08968",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "0.75rem",
                      }}
                    />
                  </Box>

                  <Typography variant="body2" sx={{ color: "#8D6E63", mt: 1 }}>
                    ${item.price}
                  </Typography>

                  <Box display="flex" alignItems="center" gap={0.5} mt={1}>
                    <Rating value={avgRating} readOnly size="small" precision={0.5} />
                  </Box>

                  <DescriptionToggle description={item.description} />
                </CardContent>

                <CardActions sx={{ justifyContent: "space-between", px: 2 }}>
                  <Button
                    variant="contained"
                    className="!bg-[#DDB892] !text-green-700 font-bold"
                    size="small"
                    disabled={isAdding || cartLoading}
                    onClick={async (e) => {
                      e.stopPropagation();
                      setAddingId(item.id);
                      try {
                        await addItem({ id_product: item.id, quantity: 1 });
                        toast.success(`"${item.name}" agregado al carrito 🛒`);
                      } catch (err) {
                        console.error("Error al agregar producto:", err);
                        toast.error("No se pudo agregar el producto");
                      } finally {
                        setTimeout(() => setAddingId(null), 1000);
                      }
                    }}
                  >
                    {isAdding ? "Agregando..." : "Agregar al carrito"}
                  </Button>
                </CardActions>
              </Card>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Box>
  );
};

// 🔹 Subcomponente de descripción expandible
const DescriptionToggle = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const truncatedHTML = truncateHTML(description, 100);

  return (
    <Box sx={{ mt: 1 }}>
      <Typography
        variant="body2"
        sx={{ color: "#555", mb: 1 }}
        dangerouslySetInnerHTML={{ __html: isExpanded ? description : truncatedHTML }}
      />
      <Button
        size="small"
        sx={{ textTransform: "none", fontWeight: "bold" }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? "Leer menos" : "Leer más"}
      </Button>
    </Box>
  );
};

export default FeaturedCarousel;


