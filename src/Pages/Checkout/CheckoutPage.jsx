// **prueba de que funcione al 100%
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../Services/Api.js";
import localidades from "../../data/localidades.json";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, setCart } = useCart();
  const [confirming, setConfirming] = useState(false);
  const [errors, setErrors] = useState({});

  // Totales del carrito
  const subtotal =
    cart?.items?.reduce(
      (sum, item) => sum + item.quantity * parseFloat(item.product.price),
      0
    ) || 0;
  const total = subtotal;

  // Card desplegable
  const [openCard, setOpenCard] = useState("personal"); // personal/envio/pago

  // Datos personales
  const [personalData, setPersonalData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  // Método de envío
  const [shippingMethod, setShippingMethod] = useState("retiro"); // retiro/envio
  const [shippingData, setShippingData] = useState({
    street: user?.street || "",
    number: user?.streetNumber || "",
    city: user?.city || "",
    province: "Córdoba",
    postalCode: user?.postalCode || "",
  });

  // Método de pago
  const [paymentMethod, setPaymentMethod] = useState("contra entrega");


  const handleConfirmPurchase = async () => {
    console.log("✅ Click en Confirmar Compra");

    if (confirming) return;

    let newErrors = {};

    // Validar usuario y carrito
    if (!user?.id) {
      newErrors.user = "No se encontró el usuario logueado.";
    }
    if (!cart?.cartId || !cart?.items?.length) {
      newErrors.cart = "Tu carrito está vacío.";
    }

    // Validar envío
    if (!shippingMethod) {
      newErrors.shippingMethod = "Por favor selecciona un método de envío.";
    } else if (shippingMethod === "envio") {
      const { street, number, city, province, postalCode } = shippingData;
      if (!street || !number || !city || !province || !postalCode) {
        newErrors.shippingData = "Completa todos los campos de envío.";
      }
    }

    // Validar pago
    if (!paymentMethod) {
      newErrors.paymentMethod = "Selecciona un método de pago.";
    }

    // Mostrar errores si existen
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Por favor completa los campos requeridos.");
      return;
    }

    setConfirming(true);
    setErrors({});

    try {
      let shippingId = null;

      // Crear envío si aplica
      if (shippingMethod === "envio") {
        const shippingPayload = {
          street: shippingData.street,
          number: shippingData.number,
          city: shippingData.city,
          province: shippingData.province,
          postalCode: shippingData.postalCode,
          estimatedDate:
            shippingData.estimatedDate ||
            new Date().toISOString().split("T")[0],
          phone: personalData.phone,
        };

        console.log("📦 Creando envío:", shippingPayload);
        const shippingResponse = await api.post("/shipping", shippingPayload);
        shippingId = shippingResponse.data.shipping.id;
        console.log("✅ Envío creado con ID:", shippingId);
      }

      // Armar items
      const items = cart.items.map((item) => ({
        id_producto: item.product.id,
        cantidad: item.quantity,
        subtotal: item.quantity * parseFloat(item.product.price),
      }));

      // Crear orden
      const orderPayload = {
        id_cart: cart.cartId,
        id_shipping: shippingId,
        id_customer: user.id,
        payment_method:
          paymentMethod === "efectivo" ? "contra entrega" : paymentMethod,
        delivery_type:
          shippingMethod === "retiro" ? "retiro en tienda" : "envio",
        subtotal,
        total,
        items,
      };

      console.log("🧾 Creando orden con datos:", orderPayload);
      const orderResponse = await api.post("/orders", orderPayload);
      console.log("✅ Orden creada correctamente:", orderResponse.data);

      // Limpiar carrito y asignar nuevo cartId
      setCart({ items: [], total: 0, cartId: orderResponse.data.newCartId });

      toast.success("Compra confirmada con éxito");
      setTimeout(() => {
        navigate("/customer/orders");
      }, 2000);
    } catch (error) {
      console.error("❌ Error en checkout:", error.response?.data || error.message);
      toast.error("No se pudo confirmar la compra.");
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">
      <div className="flex-1 space-y-4">
        {/* Card Datos Personales */}
        <div className="bg-white p-4 rounded shadow-md">
          <div
            className="flex justify-between cursor-pointer"
            onClick={() =>
              setOpenCard(openCard === "personal" ? "" : "personal")
            }
          >
            <h2 className="font-bold text-lg">Datos Personales</h2>
            {openCard === "personal" ? <ChevronUp /> : <ChevronDown />}
          </div>
          {openCard === "personal" && (
            <div className="mt-4 space-y-2">
              <input
                type="text"
                placeholder="Nombre completo"
                value={personalData.name}
                onChange={(e) =>
                  setPersonalData({ ...personalData, name: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={personalData.email}
                onChange={(e) =>
                  setPersonalData({ ...personalData, email: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Teléfono"
                value={personalData.phone}
                onChange={(e) =>
                  setPersonalData({ ...personalData, phone: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
            </div>
          )}
        </div>

        {/* Card Envío */}
        <div className="bg-white p-4 rounded shadow-md">
          <div
            className="flex justify-between cursor-pointer"
            onClick={() => setOpenCard(openCard === "envio" ? "" : "envio")}
          >
            <h2 className="font-bold text-lg">Envío</h2>
            {openCard === "envio" ? <ChevronUp /> : <ChevronDown />}
          </div>

          {openCard === "envio" && (
            <div className="mt-4 space-y-2">
              {/* Método de envío */}
              <div className="flex gap-2 mb-2">
                <button
                  className={`flex-1 py-2 cursor-pointer rounded border ${shippingMethod === "retiro"
                      ? "bg-green-600 text-white"
                      : "bg-white"
                    }`}
                  onClick={() => setShippingMethod("retiro")}
                >
                  Retiro en sucursal
                </button>
                <button
                  className={`flex-1 py-2 rounded border ${shippingMethod === "envio"
                      ? "bg-green-600 text-white"
                      : "bg-white"
                    }`}
                  onClick={() => setShippingMethod("envio")}
                >
                  Envío a domicilio
                </button>
              </div>

              {/* Formulario de envío solo si eligió envío a domicilio */}
              {shippingMethod === "envio" && (
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Calle"
                    value={shippingData.street}
                    onChange={(e) =>
                      setShippingData({
                        ...shippingData,
                        street: e.target.value,
                      })
                    }
                    className="w-full border p-2 rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Número"
                    value={shippingData.number}
                    onChange={(e) =>
                      setShippingData({
                        ...shippingData,
                        number: e.target.value,
                      })
                    }
                    className="w-full border p-2 rounded"
                    required
                  />
                  {/* ✅ Select de provincia (fija en Córdoba) */}
                  <select
                    value={shippingData.province || "Córdoba"}
                    onChange={(e) =>
                      setShippingData({ ...shippingData, province: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                    required
                  >
                    <option value="Córdoba">Córdoba</option>
                  </select>

                  {/* ✅ Select de localidad dinámico */}
                  <select
                    value={shippingData.city}
                    onChange={(e) =>
                      setShippingData({ ...shippingData, city: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                    required
                  >
                    <option value="">Selecciona una localidad</option>
                    {localidades.map((loc, i) => (
                      <option key={i} value={loc.nombre}>
                        {loc.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}


                  <input
                    type="text"
                    placeholder="Código Postal"
                    value={shippingData.postalCode}
                    onChange={(e) =>
                      setShippingData({
                        ...shippingData,
                        postalCode: e.target.value,
                      })
                    }
                    className="w-full border p-2 rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Teléfono"
                    value={shippingData.phone}
                    onChange={(e) =>
                      setShippingData({
                        ...shippingData,
                        phone: e.target.value,
                      })
                    }
                    className="w-full border p-2 rounded"
                  // required
                  />
                </div>
              )}
              {/* 🧠 Mensajes de error */}
              {errors.shippingMethod && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.shippingMethod}
                </p>
              )}
              {errors.shippingData && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.shippingData}
                </p>
              )}
            </div>
          )}
        </div>


        {/* Card Pago */}
        <div className="bg-white p-4 rounded shadow-md">
          <div
            className="flex justify-between cursor-pointer"
            onClick={() => setOpenCard(openCard === "pago" ? "" : "pago")}
          >
            <h2 className="font-bold text-lg">Pago</h2>
            {openCard === "pago" ? <ChevronUp /> : <ChevronDown />}
          </div>
          {openCard === "pago" && (
            <div className="mt-4 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  className="cursor-pointer"
                  type="radio"
                  value="contra entrega" // cambio aquí
                  checked={paymentMethod === "contra entrega"}
                  onChange={() => setPaymentMethod("contra entrega")}
                />
                Contra entrega
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  className="cursor-pointer"
                  type="radio"
                  value="transferencia" // cambio aquí
                  checked={paymentMethod === "transferencia"}
                  onChange={() => setPaymentMethod("transferencia")}
                />
                Transferencia
              </label>
              {/* 🧠 Error de pago */}
              {errors.paymentMethod && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.paymentMethod}
                </p>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          title="Confirma tu compra"
          onClick={handleConfirmPurchase}
          disabled={confirming}
          aria-busy={confirming}
          className={`w-full mt-4 font-bold py-2 rounded 
    ${confirming
              ? "bg-green-500 cursor-not-allowed opacity-80"
              : "bg-green-600 hover:bg-green-700 cursor-pointer"
            } 
    text-white flex items-center justify-center gap-2 transition-all duration-300`}
        >
          {confirming ? (
            <>
              {/* spinner SVG */}
              Confirmando…
              <svg
                className="w-5 h-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z"
                ></path>
              </svg>
            </>
          ) : (
            "Confirmar Compra"
          )}
        </button>
      </div>

      {/* Resumen de compra */}
      <div className="w-full lg:w-1/3 bg-gray-100 p-6 rounded shadow-md h-max mt-6 lg:mt-0">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Resumen de compra
        </h2>
        <div className="flex justify-between mb-2 text-gray-700">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {/* NUEVO BLOQUE: Método de envío y pago */}
        <div className="flex justify-between mb-2 text-gray-700">
          <span>Método de envío:</span>
          <span>
            {shippingMethod === "retiro"
              ? "Retiro en tienda"
              : `Envío a domicilio ${shippingData.street} ${shippingData.number}, ${shippingData.city}`}
          </span>
        </div>

        <div className="flex justify-between mb-2 text-gray-700">
          <span>Método de pago:</span>
          <span>{paymentMethod || "No seleccionado"}</span>
        </div>

        <p className="text-sm mb-5 text-gray-500">*Precio incluye IVA 21%</p>
        <hr className="my-4  border-green-900" />
        <div className="flex justify-between font-bold text-lg mb-4 text-gray-900">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
