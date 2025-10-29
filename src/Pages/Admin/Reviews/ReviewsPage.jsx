import React, { useState, useEffect } from "react";
import Pagination from "../../../Components/Pagination.jsx";
import ConfirmModal from "../../../Components/ConfirmModal.jsx";
import api from "../../../Services/Api.js";
import { ToastContainer, toast } from "react-toastify";
import ToggleSwitch from "../../../Components/ToggleSwitch.jsx";
import Loader from "../../../Components/Loader.jsx";
import {Plus} from "lucide-react";

// Subcomponente para "leer más / leer menos" en comentarios
const CommentCell = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 100;

  if (!text) return <span>Sin comentario</span>;

  const displayText =
    expanded || text.length <= maxLength
      ? text
      : `${text.substring(0, maxLength)}...`;

  return (
    <div>
      <span>{displayText}</span>
      {text.length > maxLength && (
        <button
          className="text-blue-500 ml-2 text-sm"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Leer menos" : "Leer más"}
        </button>
      )}
    </div>
  );
};

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [targetStatus, setTargetStatus] = useState("");

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    fetchReviews();
  }, [page, searchTerm, statusFilter]);


  const fetchReviews = async () => {
  try {
    setLoading(true);
    const { data } = await api.get("/admin/reviews", {
      params: {
        page,
        limit: itemsPerPage,
        search: searchTerm,
        status: statusFilter,
      },
    });

    setReviews(data.data || []);
    setTotalItems(data.pagination?.totalItems || 0); // <- aquí
  } catch (error) {
    console.error("Error al cargar reseñas:", error);
    toast.error("Error al cargar las reseñas");
  } finally {
    setLoading(false);
  }
};


  const handleToggleStatus = (review) => {
    const newStatus =
      review.status === "aprobada" ? "pendiente" : "aprobada";
    setSelectedReview(review);
    setTargetStatus(newStatus);
    setShowModal(true);
  };

  const toggleStatus = async (id, newStatus) => {
    try {
      await api.patch(`/admin/reviews/${id}/status`, { status: newStatus });
      toast.success("Estado actualizado correctamente");
      fetchReviews();
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      console.log(error.response)
      toast.error("No se pudo actualizar el estado");
    }
  };

  return (
    <div className="p-6 relative">
      {loading && <Loader />}
      <h1 className="text-2xl font-bold mb-6">Gestión de Reseñas</h1>

      {/* Controles de búsqueda y filtro */}
      <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4 ">
        <input
          type="text"
          placeholder="Buscar por cliente o producto..."
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
          className="border border-gray-300 rounded-lg p-2  w-36"
        >
          <option value="">Todos </option>
          <option value="aprobada">Aprobadas</option>
          <option value="pendiente">Pendientes</option>
        </select>
      </div>

</div>
      {/* Tabla de reseñas */}
      <div className="overflow-x-auto ">
        <table className="table-auto w-full border shadow border-gray-300">
          <thead className="text-[#835D3C]">
            <tr className="bg-gray-100">
              <th className="border p-2">Cliente</th>
              <th className="border p-2">Producto</th>
              <th className="border p-2">Calificación</th>
              <th className="border p-2">Comentario</th>
              <th className="border p-2">Estado</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reviews?.length > 0 ? (
              reviews.map((r) => (
                <tr key={r.id} >
                  <td className="border p-2">
                    {r.customer?.name || "Sin nombre"}
                  </td>
                  <td className="border p-2">
                    {r.product?.name || "Sin producto"}
                  </td>
                  <td className="border p-2 text-center">{r.ratings}</td>
                  <td className="border p-2 max-w-[250px] align-top">
                    <CommentCell text={r.comment} />
                  </td>
                  <td className="border p-2 text-center">{r.status}</td>
                  <td className="border p-2 text-center">
                    <div className="flex justify-center">
                      <ToggleSwitch
                        isActive={r.status === "aprobada"}
                        onToggle={() => handleToggleStatus(r)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="border p-4 text-center text-gray-500 font-bold"
                >
                  No se encontraron reseñas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}

      {/* Modal de confirmación de cambio de estado */}
      <ConfirmModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          toggleStatus(selectedReview?.id, targetStatus);
          setShowModal(false);
        }}
        title={`¿Confirmás cambiar el estado de esta reseña?`}
        message={`Esta acción cambiará el estado de la reseña de "${selectedReview?.customer?.name}" sobre "${selectedReview?.product?.name}".`}
      />

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ReviewsPage;

