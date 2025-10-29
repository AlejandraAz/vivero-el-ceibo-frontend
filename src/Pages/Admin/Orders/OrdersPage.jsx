// * funciona la paginacion
import React, { useEffect, useState } from "react";
import api from "../../../Services/Api.js";
import Pagination from "../../../Components/Pagination.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CreditCard,Wallet2 } from "lucide-react";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  // const [editingStatus, setEditingStatus] = useState(false);
  // const [newStatus, setNewStatus] = useState("");
  const [page, setPage] = useState(1);
const [itemsPerPage] = useState(5);
const [totalItems, setTotalItems] = useState(0);
const [searchTerm, setSearchTerm] = useState("");
const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
const [statusFilter, setStatusFilter] = useState("");
const [shippingFilter, setShippingFilter] = useState("");



  const statusOptions = ["pendiente", "procesando", "completado", "cancelado"];

  // Debounce para buscador
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);


  const getStatusBadge = (status) => {
    switch (status) {
      case "pendiente":
        return "bg-yellow-200 text-yellow-800";
      case "procesando":
        return "bg-blue-200 text-blue-800";
      case "completado":
        return "bg-green-200 text-green-800";
      case "cancelado":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/orders",{
      params: {
        page,
        limit: itemsPerPage,
        search: debouncedSearch,
        status: statusFilter,
        shippingStatus: shippingFilter,
      },
    });
    console.log(res.data);

      setOrders(res.data.orders || []);
      setTotalItems(res.data.totalItems || 0);
      setPage(res.data.currentPage || 1);
      // setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      // setLoading(false);
    }finally {
    setLoading(false);
  }
  };

  useEffect(() => {
    fetchOrders();
  }, [debouncedSearch, statusFilter, shippingFilter, page]);


  if (loading) return <p className="font-bold text-green-900">Cargando órdenes...</p>;
  // if (!orders.length) return <p className="font-bold text-green-900">No hay órdenes aún.</p>;

  

  return (
    
    <div className="overflow-x-auto">

      <div className="flex items-center justify-between mb-6">
  <div className="flex items-center gap-4">
    <input
      type="text"
      placeholder="Buscar por cliente, email o nro de orden..."
      value={searchTerm}
      onChange={(e) => {
        setPage(1);
        setSearchTerm(e.target.value);
      }}
      className="border border-gray-300 rounded-lg p-2 flex-1 min-w-[200px]"
    />

    <select
      value={statusFilter}
      onChange={(e) => {
        setPage(1);
        setStatusFilter(e.target.value);
      }}
      className="border border-gray-300 rounded-lg p-2 w-36"
    >
      <option value="">Todos</option>
      <option value="pendiente">Pendientes</option>
      <option value="procesando">Procesando</option>
      <option value="completado">Completados</option>
      <option value="cancelado">Cancelados</option>
    </select>

    {/* prueba p/ filtrar tambien por envio */}
    <select
    value={shippingFilter}
    onChange={(e) => {
      setPage(1);
      setShippingFilter(e.target.value);
    }}
    className="border border-gray-300 rounded-lg p-2 w-36"
  >
    <option value="">Todos los envíos</option>
    <option value="pendiente">Pendiente</option>
    <option value="preparando">Preparando</option>
    <option value="enviado">Enviado</option>
    <option value="entregado">Entregado</option>
    <option value="cancelado">Cancelado</option>
  </select>





  </div>
</div>


{/* tabla */}
      <table className="table-auto w-full border border-gray-300 shadow">
  <thead className="text-[#835D3C]">
    <tr className="bg-gray-100">
      <th className="py-2 px-4 border text-left border-gray-300">Orden Nro</th>
      <th className="py-2 px-4 border border-gray-300">Estado Pedido</th>
      <th className="py-2 px-4 border border-gray-300">Estado Envío</th>
      <th className="py-2 px-4 border border-gray-300">Pago</th>
      <th className="py-2 px-4 border border-gray-300">Entrega</th>
      <th className="py-2 px-4 border text-right border-gray-300">Total</th>
      <th className="py-2 px-4 border border-gray-300">Detalle</th>
    </tr>
  </thead>

  <tbody>
    {orders.length > 0 ? (
    orders.map((order) => (
      <tr key={order.id} className="hover:bg-gray-50">
        <td className="py-2 px-4 border border-gray-300">
          ORD-{order.number_order.toString().padStart(6, "0")}
        </td>

        {/* Estado del pedido */}
        <td className="py-2 px-4 border border-gray-300">
          <select
            value={order.estado}
            onChange={async (e) => {
              const newStatus = e.target.value;
              try {
                await api.put(`/admin/orders/${order.id}/status`, { status: newStatus });
                setOrders((prev) =>
                  prev.map((o) =>
                    o.id === order.id ? { ...o, estado: newStatus } : o
                  )
                );
                toast.success("Estado del pedido actualizado");
              } catch (err) {
                console.error("Error updating status:", err);
                toast.error("Error al actualizar estado");
              }
            }}
            className={`px-3 py-1 rounded font-semibold transition-colors duration-500 w-full text-center ${getStatusBadge(order.estado)}`}
          >
            {statusOptions.map((s) => (
              <option key={s} value={s.toLowerCase()}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </td>

        {/* Estado de envío */}
        <td className="py-2 px-4 border border-gray-300">
          <select
            value={
              order.delivery_type === "retiro en local"
                ? "retiro en local"
                : order.shipping?.shippingStatus || "pendiente"
            }
            onChange={async (e) => {
              const newShippingStatus = e.target.value;
              if (order.delivery_type === "retiro en local") return;

              try {
                if (!order.shipping?.id) return;

                await api.put(`/admin/shipping/${order.shipping.id}/status`, {
                  shipping_status: newShippingStatus,
                });

                setOrders((prev) =>
                  prev.map((o) =>
                    o.id === order.id
                      ? {
                          ...o,
                          shipping: {
                            ...o.shipping,
                            shippingStatus: newShippingStatus,
                          },
                        }
                      : o
                  )
                );
                toast.success("Estado de envío actualizado");
              } catch (err) {
                console.error("Error updating shipping status:", err);
              }
            }}
            className={`px-3 py-1 rounded font-semibold w-full text-center ${
              order.delivery_type === "retiro en local"
                ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                : "bg-gray-300 text-gray-600 cursor-pointer"
            }`}
            disabled={order.delivery_type === "retiro en tienda"}
          >
            {order.delivery_type === "retiro en tienda" ? (
              <option value="retiro en tienda">Retiro en tienda</option>
            ) : (
              ["pendiente", "preparando", "enviado", "entregado", "cancelado"].map(
                (s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                )
              )
            )}
          </select>
        </td>

        <td className="py-2 px-4 border border-gray-300">
          {order.payment_method || "N/A"}
        </td>

        <td className="py-2 px-4 border border-gray-300">
          {order.delivery_type || "N/A"}
        </td>

        <td className="py-2 px-4 border text-right border-gray-300">
          ${order.total.toFixed(2)}
        </td>

        <td className="py-2 px-4 border border-gray-300 text-center">
          <button
            onClick={() => setSelectedOrder(order)}
            className="bg-[#8B5E3C] hover:bg-[#A65F46] text-white px-3 py-1 rounded transition-colors duration-300"
          >
            Ver detalle
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="7" className="text-center py-4 text-green-900 font-bold">
        No se encontraron órdenes con esos criterios.
      </td>
    </tr>
  )}
  </tbody>
</table>

{/* pagination */}

{totalItems > itemsPerPage && (
  <div className="mt-6">
    <Pagination
      currentPage={page}
      totalPages={Math.ceil(totalItems / itemsPerPage)}
      onPageChange={(p) => setPage(p)}
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
    />
  </div>
)}

      {/* Modal detalle */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-rose-50 bg-opacity-50">
          {console.log("Detalle del pedido seleccionado:", selectedOrder)}
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setSelectedOrder(null)}
            >
              ✕
            </button>
            <h2 className="text-xl text-[#664325] font-bold mb-4">Detalle de Pedido #ORD-{String(selectedOrder.number_order).padStart(4, "0")}</h2>

            
{/* Info cliente reorganizada */}
<div className="mb-4 p-4 bg-green-50 text-[#664325] rounded-lg space-y-2">
  <div><strong>Cliente:</strong> {selectedOrder.customer?.name}</div>
  <div><strong>Email:</strong> {selectedOrder.customer?.email}</div>
  <div><strong>Teléfono:</strong> {" "}
  {selectedOrder.shipping?.phone || selectedOrder.customer?.phone || "No registrado"}</div>
  <div><strong>Fecha de compra:</strong> {new Date(selectedOrder.fecha_creacion).toLocaleString()}</div>
  {/* <div><strong>Fecha estimada de entrega:</strong> {new Date(selectedOrder.shipping?.estimatedDate).toLocaleDateString("es-AR")}</div> */}
  <div>
  <strong>Fecha estimada de entrega:</strong>{" "}
  {selectedOrder.shipping?.estimatedDate
    ? new Date(selectedOrder.shipping.estimatedDate).toLocaleDateString("es-AR")
    : "N/A"}
</div>

  <div>
    <strong>Dirección de envío:</strong>{" "}
    {selectedOrder.shipping &&
      (selectedOrder.shipping.street || selectedOrder.shipping.calle)
        ? `${selectedOrder.shipping.street || selectedOrder.shipping.calle} ${
            selectedOrder.shipping.number || selectedOrder.shipping.nro || ""
          }, ${selectedOrder.shipping.city || selectedOrder.shipping.ciudad || ""}, ${
            selectedOrder.shipping.province || ""
          } (${selectedOrder.shipping.postalCode || ""})`
        : "Retiro en tienda"}
  </div>
  {/* <div><strong>Forma de pago:</strong> {selectedOrder.payment_method || "No especificado"}</div> */}
  <div className="flex items-center gap-2">
  <strong>Forma de pago:</strong>
  <span
    className={`px-2 py-1 rounded text-sm font-medium ${
      selectedOrder.payment_method === "transferencia"
        ? "bg-blue-100 text-blue-800"
        : selectedOrder.payment_method === "contra entrega"
        ? "bg-amber-100 text-amber-800"
        : "bg-gray-100 text-gray-800"
    }`}
  >
    {selectedOrder.payment_method
      ? selectedOrder.payment_method.charAt(0).toUpperCase() +
        selectedOrder.payment_method.slice(1)
      : "No especificado"}
  </span>
</div>



</div>


            {/* Tabla productos */}
            <table className="table-auto w-full border border-gray-300 shadow">
              <thead className="text-[#835D3C]">
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border border-gray-300 text-left">Producto</th>
                  <th className="py-2 px-4 border border-gray-300 text-right">Precio Unitario</th>
                  <th className="py-2 px-4 border border-gray-300 text-right">Cantidad</th>
                  <th className="py-2 px-4 border border-gray-300 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.products.map((p, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border border-gray-300 text-left">{p.name}</td>
                    <td className="py-2 px-4 border border-gray-300 text-right">${p.price.toFixed(2)}</td>
                    <td className="py-2 px-4 border border-gray-300 text-right">{p.quantity}</td>
                    <td className="py-2 px-4 border border-gray-300 text-right">${p.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
                
              </tbody>
            
              <tfoot className="bg-gray-50 font-semibold">
    <tr>
      <td colSpan="3" className="py-2 px-4 text-right border border-gray-300">Total:</td>
      <td className="py-2 px-4 text-right border border-gray-300">${selectedOrder.total.toFixed(2)}</td>
    </tr>
  </tfoot>

            </table>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default OrdersPage;
