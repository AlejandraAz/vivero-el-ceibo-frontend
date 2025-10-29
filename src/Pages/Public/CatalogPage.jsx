
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../../Services/Api.js";
import ProductCardCatalog from "./ProductCardCatalog.jsx";
import { useCart } from "../../context/CartContext.jsx";
import Loader from "../../Components/Loader.jsx";
import { Grid, List, Star, ArrowUpDown, ShoppingCart } from "lucide-react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Rating,
} from "@mui/material";

// 🔹 Helper para truncar HTML
const truncateHTML = (html, limit) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  let text = div.textContent || div.innerText || "";
  if (text.length <= limit) return html;
  text = text.substring(0, limit);
  return text + "...";
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
        onClick={(e) => {
          e.stopPropagation(); // evita que navegue al detalle
          setIsExpanded(!isExpanded);
        }}
      >
        {isExpanded ? "Leer menos" : "Leer más"}
      </Button>
    </Box>
  );
};

// 🔹 Card de lista
const ProductCardList = ({ product }) => {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);
  const navigate = useNavigate();
  const mainImage = product.images?.find((img) => img.is_main) || product.images?.[0];
  const avgRating = product.reviews?.length
    ? product.reviews.reduce((sum, r) => sum + Number(r.ratings), 0) / product.reviews.length
    : 0;

  const isNew = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffDays = (now - created) / (1000 * 60 * 60 * 24);
    return diffDays < 15;
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        borderRadius: 2,
        backgroundColor: "#FFF8F0",
        boxShadow: 3,
        cursor: "pointer",
        transition: "0.3s",
        "&:hover": { boxShadow: 6 },
        p: 2,
      }}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <CardMedia
        component="img"
        sx={{
          width: { xs: "100%", sm: 120 },
          height: { xs: 200, sm: 120 },
          objectFit: "cover",
          borderRadius: 2,
          flexShrink: 0,
        }}
        image={mainImage?.url || "/placeholder.jpg"}
        alt={product.name}
      />

      <Box sx={{ flex: 1, ml: { xs: 0, sm: 2 }, mt: { xs: 2, sm: 0 } }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#6A994E" }}>
              {product.name}
            </Typography>
            <Rating value={avgRating} readOnly size="small" precision={0.5} />
          </Box>

          {isNew(product.fecha_creacion) && (
            <Chip
              label="Nuevo"
              size="small"
              sx={{
                backgroundColor: "#6A994E",
                color: "white",
                fontWeight: "bold",
                fontSize: "0.75rem",
              }}
            />
          )}
        </Box>

        <Typography variant="body2" sx={{ color: "#8D6E63", mt: 1 }}>
          ${parseFloat(product.price).toFixed(2)}
        </Typography>

        <DescriptionToggle description={product.description} />

        <Box sx={{ mt: 1 }}>
          {/* <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: "#DDB892",
              color: "#6A994E",
              fontWeight: "bold",
              textTransform: "none",
            }}
            onClick={(e) => {
    e.stopPropagation(); 
    addItem({ id_product: product.id, quantity: 1 });
  }}
          >
            Agregar al carrito <ShoppingCart size={18} style={{ marginLeft: 4 }} />
          </Button> */}
          <Button
  variant="contained"
  size="small"
  sx={{
    backgroundColor: adding ? "#6A994E" : "#DDB892",
    color: adding ? "#fff" : "#6A994E",
    fontWeight: "bold",
    textTransform: "none",
  }}
  onClick={async (e) => {
    e.stopPropagation();
    setAdding(true);
    try {
      await addItem({ id_product: product.id, quantity: 1 });
      // toast.success(`"${product.name}" agregado al carrito`);
    } catch (err) {
      toast.error("No se pudo agregar al carrito");
      console.error(err);
    }
    setTimeout(() => setAdding(false), 1500); // vuelve al estado normal después de 1.5s
  }}
  disabled={adding} // evita clicks repetidos mientras se agrega
>
  {adding ? "Agregado" : "Agregar al carrito"} <ShoppingCart size={18} style={{ marginLeft: 4 }} />
</Button>

        </Box>
      </Box>
    </Card>
  );
};

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showFeatured, setShowFeatured] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          `/products/catalog?page=${page}&limit=8${showFeatured ? "&featured=true" : ""}&order=${sortOrder}`
        );
        setProducts(res.data.products || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, showFeatured, sortOrder]);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* 🔍 Controles superiores */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          gap: 2,
          mb: 4,
        }}
      >
        {/* Filtros */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          <Button
            onClick={() => setShowFeatured(!showFeatured)}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              px: 2,
              py: 1,
              borderRadius: 2,
              border: "1px solid #B08968",
              bgcolor: showFeatured ? "#6A994E" : "#FFF8F0",
              color: showFeatured ? "#fff" : "#6A994E",
              "&:hover": { bgcolor: showFeatured ? "#6A994E" : "#FFF8F0" },
            }}
          >
            <Star size={16} /> {showFeatured ? "Solo ofertas" : "Todas las plantas"}
          </Button>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #B08968",
              borderRadius: 2,
              px: 1,
              bgcolor: "#FFF8F0",
            }}
          >
            <ArrowUpDown size={16} color="#6A994E" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                color: "#6A994E",
                fontWeight: "bold",
                fontSize: 14,
                marginLeft: 4,
              }}
            >
              <option value="newest">Más recientes</option>
              <option value="price_asc">Precio: menor a mayor</option>
              <option value="price_desc">Precio: mayor a menor</option>
            </select>
          </Box>
        </Box>

        {/* Vista cuadrícula / lista */}
        <Box sx={{ display: "flex", gap: 1, mt: { xs: 2, sm: 0 } }}>
          <Button
            onClick={() => setViewMode("grid")}
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: viewMode === "grid" ? "#6A994E" : "#FFF8F0",
              color: viewMode === "grid" ? "#fff" : "#6A994E",
              border: "1px solid #B08968",
            }}
          >
            <Grid size={18} />
          </Button>
          <Button
            onClick={() => setViewMode("list")}
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: viewMode === "list" ? "#6A994E" : "#FFF8F0",
              color: viewMode === "list" ? "#fff" : "#6A994E",
              border: "1px solid #B08968",
            }}
          >
            <List size={18} />
          </Button>
        </Box>
      </Box>

      {/* 🪴 Productos */}
      {loading ? (
        <Loader />
      ) : products.length === 0 ? (
        <Typography sx={{ textAlign: "center", color: "#6A994E" }}>
          No se encontraron productos.
        </Typography>
      ) : viewMode === "grid" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <ProductCardCatalog key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {products.map((p) => (
            <ProductCardList key={p.id} product={p} />
          ))}
        </Box>
      )}

      {/* 📄 Paginación */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}>
        <Button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
          sx={{ border: "1px solid #B08968", color: "#6A994E" }}
        >
          Anterior
        </Button>
        <Typography sx={{ alignSelf: "center", fontWeight: "bold", color: "#6A994E" }}>
          Página {page} de {totalPages}
        </Typography>
        <Button
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={page === totalPages}
          sx={{ border: "1px solid #B08968", color: "#6A994E" }}
        >
          Siguiente
        </Button>
      </Box>
    </section>
  );
}
