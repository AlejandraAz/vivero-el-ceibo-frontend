import Loader from "../../Components/Loader.jsx";
import React, { useEffect, useState } from "react";
import api from "../../Services/Api.js";
import {
  Truck,
  Home,
  Clock,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openOrderId, setOpenOrderId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6; // pedidos por página

  const fetchOrders = async (page) => {
    setLoading(true);
    try {
      const res = await api.get(`/customer/profile/my-orders?page=${page}&limit=${limit}`);
      setOrders(res.data.orders);
      setTotalPages(res.data.totalPages);
      // setLoading(false);
      setTimeout(() => {
  setLoading(false);
}, 850);
    } catch (err) {
      console.error("[DEBUG] Error fetching orders:", err);
      setError("Error al obtener tus pedidos.");
    setTimeout(() => {
      setLoading(false);
    }, 850);
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const toggleOrder = (id) => {
    setOpenOrderId(openOrderId === id ? null : id);
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  if (loading) return <Loader />;
  if (error) return <div>{error}</div>;

  return (
    <>
    {loading && <Loader />}
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Mis Pedidos</h2>

      {orders.length === 0 ? (
        <p className="text-green-800 font-bold text-2xl">No tienes pedidos registrados.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orders.map((order) => {
              const totalNumber = Number(order.total).toFixed(2);
              const isOpen = openOrderId === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">
                      Pedido #{order.number_order}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-lg text-white ${
                        order.status === "completado"
                          ? "bg-green-500"
                          : order.status === "pendiente"
                          ? "bg-yellow-500"
                          : "bg-gray-500"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center">
                      {order.delivery_type === "envio" ? (
                        <>
                          <Truck className="w-5 h-5 text-blue-500 mr-2" />
                          <span>Envío a domicilio</span>
                        </>
                      ) : (
                        <>
                          <Home className="w-5 h-5 text-green-500 mr-2" />
                          <span>Retiro en tienda</span>
                        </>
                      )}
                    </div>
                    <button
                      className="flex items-center text-sm text-gray-500"
                      onClick={() => toggleOrder(order.id)}
                    >
                      {isOpen ? "Ocultar detalles" : "Ver detalles"}
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 ml-1" />
                      ) : (
                        <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </button>
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-[1000px]" : "max-h-0"
                    }`}
                  >
                    {isOpen && (
                      <div className="mt-2 border-t pt-4">
                        {order.delivery_type === "envio" && order.shipping && (
                          <div className="mb-2 p-2 border rounded bg-gray-50 text-sm">
                            {`${order.shipping.street} ${order.shipping.number}, ${order.shipping.city}, ${order.shipping.province}, CP: ${order.shipping.postalCode}`}
                          </div>
                        )}

                        {order.delivery_type === "envio" &&
                          order.shipping?.estimatedDate && (
                            <div className="mb-4 p-2 border rounded bg-gray-50 text-sm">
                              Fecha estimada de entrega:{" "}
                              {new Date(
                                order.shipping.estimatedDate
                              ).toLocaleDateString()}
                            </div>
                          )}

                        <div className="mb-4">
                          <p className="text-sm font-semibold">Productos:</p>
                          {order.details && order.details.length > 0 ? (
                            <ul>
                              {order.details.map((detail) => (
                                <li
                                  key={detail.id}
                                  className="flex items-center mb-2"
                                >
                                  <img
                                    src={
                                      detail.product.images?.[0]?.url ||
                                      "default-image.jpg"
                                    }
                                    alt={detail.product.name}
                                    className="w-12 h-12 object-cover rounded-md mr-4"
                                  />
                                  <div>
                                    <p>{detail.product.name}</p>
                                    <p className="text-sm text-gray-500">
                                      {detail.quantity} x $
                                      {Number(detail.unit_price).toFixed(2)}
                                    </p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>No hay productos en este pedido.</p>
                          )}
                        </div>

                        <div className="flex justify-between items-center mb-2">
                          <span className="text-lg font-semibold">Total:</span>
                          <span className="text-lg font-bold">${totalNumber}</span>
                        </div>

                        {order.delivery_type === "envio" && order.shipping && (
                          <div className="mt-2 flex items-center">
                            {order.shipping.shipping_status === "enviado" && (
                              <Truck className="w-5 h-5 text-green-500 mr-2" />
                            )}
                            {order.shipping.shipping_status === "pendiente" && (
                              <Clock className="w-5 h-5 text-yellow-500 mr-2" />
                            )}
                            {order.shipping.shipping_status === "cancelado" && (
                              <XCircle className="w-5 h-5 text-red-500 mr-2" />
                            )}
                            <span className="text-sm text-gray-500">
                              Estado de Envío:{" "}
                              {order.shipping.shipping_status || "Sin información"}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Paginación */}
          <div className="flex justify-center items-center mt-6 gap-4">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              Anterior
            </button>
            <span>
              Página {page} de {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
    </>
  );
};

export default MyOrders;
