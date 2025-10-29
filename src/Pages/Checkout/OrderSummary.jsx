import React from "react";
import api from "../../Services/Api.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function OrderSummary({ cart, deliveryMethod, shippingData, goBack }) {
    const navigate = useNavigate()
  // Evitar errores si cart está vacío
  const items = cart?.items || [];

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * parseFloat(item.product.price),
    0
  );
  const impuestos = subtotal * 0.21;
  const total = subtotal + impuestos;

  const handleConfirm = async() => {
     try {
    if (!cart.items.length) return;

    console.log("cartItems:", cart.items);
console.log("deliveryMethod:", deliveryMethod);
console.log("shippingData:", shippingData);

    const response = await api.post("/orders", {
      cartItems: cart.items,
      deliveryMethod,
      shippingData,
      paymentMethod: "contrareembolso", // por ahora fijo
    });

    toast.success("Pedido creado correctamente!");
    console.log("Orden creada:", response.data);

    // Redirigir a página de éxito o historial de pedidos
    navigate("/orders");
  } catch (error) {
    console.error(error);
    toast.error("Error al crear la orden. Intenta nuevamente.");
  }
      };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4" style={{ color: "#3A6B35" }}>
        Resumen de tu pedido
      </h2>

      {/* Lista de productos */}
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between p-2 border rounded bg-green-50"
          >
            <div className="flex items-center gap-2">
              <img
                src={item.product.images?.[0]?.url || "/placeholder.jpg"}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded"
              />
              <span className="font-semibold text-green-900">{item.product.name}</span>
            </div>
            <div className="text-green-800 font-medium">
              {item.quantity} x ${parseFloat(item.product.price).toFixed(2)}
            </div>
            <div className="text-green-700 font-bold">
              ${(item.quantity * parseFloat(item.product.price)).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Totales */}
      <div className="mt-4 p-2 border rounded bg-green-100">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Impuestos (21%):</span>
          <span>${impuestos.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg mt-2">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Método de entrega */}
      <div className="mt-4 p-2 border rounded bg-[#F6E7DC]">
        <h3 className="font-bold mb-2">Método de entrega:</h3>
        <p className="text-green-900 capitalize">{deliveryMethod}</p>

        {deliveryMethod === "envio" && shippingData && (
          <div className="mt-2 p-2 border rounded bg-green-50">
            <h4 className="font-semibold">Datos de envío:</h4>
            <p>{shippingData.name}</p>
            <p>
              {shippingData.street} {shippingData.number}
            </p>
            <p>
              {shippingData.city} - {shippingData.postalCode}
            </p>
            <p>Tel: {shippingData.phone}</p>
          </div>
        )}
      </div>

      {/* Botones */}
      <div className="flex justify-between mt-6 gap-4">
        <button
          onClick={goBack}
          className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
        >
          Volver
        </button>
        <button
          onClick={handleConfirm}
          className="flex-1 bg-[#B08968] text-white py-2 rounded hover:bg-[#A3785C]"
        >
          Confirmar pedido
        </button>
      </div>
    </div>
  );
}
