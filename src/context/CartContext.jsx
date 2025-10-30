
import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext.jsx";
import { 
  getMyCart, 
  createCart, 
  addCartItem, 
  updateCartItem, 
  deleteCartItem 
} from "../Services/cartApi.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0, cartId: null });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔄 Traer carrito del usuario logueado
  useEffect(() => {
    if (!authLoading && user && user.rol === "cliente") {
      fetchCart();
    } else if (!user && !authLoading) {
      // limpiar carrito al hacer logout
      setCart({ items: [], total: 0, cartId: null });
    }
  }, [user, authLoading]);

  // 📦 Obtener carrito
  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await getMyCart();
      // console.log("fetchCart - response:", res.data);
      const data = res.data.data;

      if (data?.cartId) {
        setCart({
          items: data.items || [],
          total: data.items.reduce((sum, i) => sum + parseFloat(i.subtotal), 0),
          cartId: data.cartId
        });
      } else {
        setCart({ items: [], total: 0, cartId: null });
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      toast.error("No se pudo cargar tu carrito");
    } finally {
      setLoading(false);
    }
  };

  // 🛒 Agregar producto al carrito
  const addItem = async ({ id_product, quantity = 1 }) => {
    if (authLoading) {
      toast.info("Verificando sesión...");
      return;
    }

    if (!user || !user.id) {
      toast.info("Debes iniciar sesión para agregar productos");
      navigate("/login");
      return;
    }

    try {
      let cartId = cart.cartId;

      // Crear carrito si no existe
      if (!cartId) {
        const newCartResponse = await createCart({ id_customer: user.id });
        const newCart = newCartResponse.data.data;
        cartId = newCart.id;
      }

      // Agregar producto
      await addCartItem({ id_cart: cartId, id_product, quantity });

      // Actualizar vista
      await fetchCart();

      toast.success("Producto agregado al carrito");
    } catch (err) {
      console.error("Error adding item:", err);
      toast.error("No se pudo agregar el producto");
    }
  };

  // ✏️ Actualizar cantidad de un item
  const updateItem = async (itemId, quantity) => {
    try {
      await updateCartItem(itemId, { quantity });
      setCart(prev => ({
        ...prev,
        items: prev.items.map(i => 
          i.id === itemId ? { ...i, quantity } : i
        )
      }));
      toast.success("Cantidad actualizada");
    } catch (err) {
      console.error("Error updating item:", err);
      toast.error("No se pudo actualizar el producto");
    }
  };

  // ❌ Eliminar producto
  const removeItem = async (itemId) => {
    try {
      await deleteCartItem(itemId);
      setCart(prev => ({
        ...prev,
        items: prev.items.filter(i => i.id !== itemId)
      }));
      // toast.success("Producto eliminado del carrito");
    } catch (err) {
      console.error("Error removing item:", err);
      toast.error("No se pudo eliminar el producto");
    }
  };

  //  Limpiar carrito manualmente (por ejemplo, al hacer logout)
  const clearCart = () => {
    setCart({ items: [], total: 0, cartId: null });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        loading,
        addItem,
        updateItem,
        removeItem,
        fetchCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

