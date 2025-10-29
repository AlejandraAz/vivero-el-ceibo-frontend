import { Box, Card, CardMedia, CardContent, CardActions, Typography, Button, Chip, Rating } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../../context/CartContext.jsx";
import { toast } from "react-toastify";

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
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                }}
            >
                {isExpanded ? "Leer menos" : "Leer más"}
            </Button>
        </Box>
    );
};

// 🔹 Card principal
const ProductCardCatalog = ({ product }) => {
    const navigate = useNavigate();

    const { addItem, loading: cartLoading } = useCart();
    const [adding, setAdding] = useState(false);
    const mainImage = product.images?.find((img) => img.is_main) || product.images?.[0];
    const avgRating = product.reviews?.length
        ? product.reviews.reduce((sum, r) => sum + Number(r.ratings), 0) / product.reviews.length
        : 0;

    const isNew = (createdAt) => {
        const now = new Date();
        const created = new Date(createdAt);
        const diffDays = (now - created) / (1000 * 60 * 60 * 24);
        return diffDays < 15; // Considera "nuevo" si tiene menos de 15 días
    };
    return (
        <Card
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
            onClick={() => navigate(`/product/${product.id}`)}
        >
            <Box sx={{ position: "relative" }}>
                <CardMedia
                    component="img"
                    sx={{ height: 200, objectFit: "cover" }}
                    image={mainImage?.url || "/placeholder.jpg"}
                    alt={product.name}
                />
                {isNew(product.fecha_creacion) && (
                    <Chip
                        label="Nuevo"
                        size="small"
                        sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            backgroundColor: "#6A994E",
                            color: "#fff",
                            fontWeight: "bold",
                            fontSize: "0.75rem",
                        }}
                    />
                )}
            </Box>
            <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#6A994E" }}>
                        {product.name}
                    </Typography>
                    {product.featured && (
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
                    )}
                </Box>

                <Typography variant="body2" sx={{ color: "#8D6E63", mt: 1 }}>
                    ${product.price}
                </Typography>

                <Box display="flex" alignItems="center" gap={0.5} mt={1}>
                    <Rating value={avgRating} readOnly size="small" precision={0.5} />
                </Box>

                <DescriptionToggle description={product.description} />
            </CardContent>

            <CardActions sx={{ justifyContent: "space-between", px: 2 }}>
                <Button
  variant="contained"
  size="small"
  disabled={adding || cartLoading} // 🔸 evita doble clic
  sx={{
    backgroundColor: adding ? "#6A994E" : "#DDB892",
    color: adding ? "#fff" : "#6A994E",
    fontWeight: "bold",
  }}
  onClick={async (e) => {
    e.stopPropagation();
    setAdding(true);
    try {
      await addItem({ id_product: product.id, quantity: 1 });
    //   toast.success(`"${product.name}" agregado al carrito `);
    } catch (err) {
      toast.error("No se pudo agregar el producto");
    } finally {
      setTimeout(() => setAdding(false), 1200);
    }
  }}
>
  {adding ? "Agregando..." : "Agregar al carrito"}
</Button>
            </CardActions>
        </Card>
    );
};

export default ProductCardCatalog;
