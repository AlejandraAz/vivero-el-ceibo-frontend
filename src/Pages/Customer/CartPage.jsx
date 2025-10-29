
import React, { useState } from "react";
import ConfirmModal from "../../Components/ConfirmModal.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { Plus, Minus, Trash2, ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, updateItem, removeItem, fetchCart } = useCart();
  const [updatingItem, setUpdatingItem] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);


  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <p className="text-center text-green-800 text-lg mt-10 font-semibold">
        Tu carrito está vacío
      </p>
    );
  }

  const total = cart.items.reduce(
    (sum, item) => sum + item.quantity * parseFloat(item.product.price),
    0
  );

  

  const handleIncrease = async (item) => {
    if (item.quantity >= item.product.stock) {
      toast.info("No puedes agregar más unidades que el stock disponible");
      return;
    }
    setUpdatingItem(item.id);
    await updateItem(item.id, item.quantity + 1);
    await fetchCart();
    setUpdatingItem(null);
  };

  const handleDecrease = async (item) => {
    if (item.quantity <= 1) return;
    setUpdatingItem(item.id);
    await updateItem(item.id, item.quantity - 1);
    await fetchCart();
    setUpdatingItem(null);
  };


  const handleRemove = (item) => {
  setSelectedItem(item);
  setConfirmOpen(true);
};


const confirmRemove = async () => {
  if (!selectedItem) return;
  setUpdatingItem(selectedItem.id);

  try {
    // console.log("→ Ejecutando removeItem", selectedItem.id);
    await removeItem(selectedItem.id); // ya muestra el toast
    //  console.log("→ removeItem completado");
    await fetchCart();
    toast.success("Producto eliminado del carrito");
  } catch (err) {
    console.error("Error al eliminar:", err);
    toast.error("No se pudo eliminar el producto");
  } finally {
    setUpdatingItem(null);
    setSelectedItem(null);
    setConfirmOpen(false); // 👈 cerrar el modal aquí
  }
};


  return (
    <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">
      {/* Lista de productos */}
      <div className="flex-1 space-y-4">
        {/* Header escritorio */}
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_0.5fr] gap-4 font-bold border-b-2 border-green-700 pb-2 text-green-900">
          <span>Producto</span>
          <span>Precio</span>
          <span>Cantidad</span>
          <span>Subtotal</span>
          <span>Acción</span>
        </div>

        {cart.items.map((item, index) => {
          const subtotal = item.quantity * parseFloat(item.product.price);

          return (
            <div key={item.id}>
              <div
                className={`grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_0.5fr] gap-4 items-center bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition ${
                  updatingItem === item.id ? "opacity-50" : ""
                }`}
              >
                {/* Producto */}
                <div className="flex items-center gap-4">
                  <img
                    src={item.product.images?.[0]?.url || "/placeholder.jpg"}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover"
                  />
                  <span className="font-semibold text-green-900 text-lg">
                    {item.product.name}
                  </span>
                </div>

                {/* Precio escritorio */}
                <div className="text-green-700 font-medium hidden md:block">
                  ${parseFloat(item.product.price).toFixed(2)}
                </div>

                {/* Cantidad + eliminar en móvil */}
                <div className="flex items-center gap-2 justify-start md:justify-center">
                  <button
                    onClick={() => handleDecrease(item)}
                    className="px-2 py-1 border border-green-600 rounded hover:bg-green-100 cursor-pointer"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-gray-800 font-medium">{item.quantity}</span>
                  <button
                    onClick={() => handleIncrease(item)}
                    className="px-2 py-1 border border-green-600 rounded hover:bg-green-100 cursor-pointer"
                  >
                    <Plus size={16} />
                  </button>

                  {/* Botón eliminar en móvil */}
                  <button
                    onClick={() => handleRemove(item)}
                    className="ml-2 text-red-600 hover:text-red-800 cursor-pointer md:hidden"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Subtotal escritorio */}
                <div className="font-semibold text-green-800 hidden md:block">
                  ${subtotal.toFixed(2)}
                </div>

                {/* Eliminar escritorio */}
                <div className="flex justify-center hidden md:block">
                  <button
                    onClick={() => handleRemove(item)}
                    className="text-red-600 hover:text-red-800 cursor-pointer"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                {/* Vista móvil */}
                <div className="md:hidden text-sm text-gray-700 space-y-1 pl-2 mt-2 border-t pt-2">
                  <p>
                    <span className="font-semibold">Precio:</span> $
                    {parseFloat(item.product.price).toFixed(2)}
                  </p>
                  <p>
                    <span className="font-semibold">Subtotal:</span> ${subtotal.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* HR estilizado */}
              {index < cart.items.length - 1 && (
                <hr className="border-green-200 my-2" />
              )}
            </div>
          );
        })}
      </div>

      {/* Resumen de compra (pantalla lg) */}
      <div className="w-full lg:w-1/3 bg-gray-100 p-6 rounded shadow-md h-max mt-6 lg:mt-0">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Resumen de compra</h2>
        <div className="flex justify-between mb-2 text-gray-700">
          <span>Subtotal:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <p className="text-sm mb-5 text-gray-500">*Precio incluye IVA 21%</p>
        <hr className="my-4  border-green-900" />
        <div className="flex justify-between font-bold text-lg mb-4 text-gray-900">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button className="w-full  font-bold bg-green-600 text-white py-2 rounded hover:bg-green-700 mb-4 cursor-pointer" onClick={() => navigate("/customer/checkout")}>
          Finalizar Compra
        </button>

        {/* Continuar comprando */}
        <Link
          to="/catalog"
          className="flex items-center justify-center font-bold cursor-pointer md:justify-start text-green-700 hover:underline"
        >
          <ChevronLeft size={16} className="mr-1" />
          <ChevronLeft size={16} className="mr-2" />
          <span>Continuar comprando</span>
        </Link>
      </div>

      <ConfirmModal
  open={confirmOpen}
  onClose={() => setConfirmOpen(false)}
  onConfirm={confirmRemove}
  title="Eliminar producto"
  message="¿Estás seguro de que deseas eliminar este producto del carrito?"
/>


      {/* <ToastContainer position="top-right" autoClose={2500} /> */}
    </div>
  );
};

export default CartPage;
