import SearchFilter from './SearchFilter';
import CategoryModal from './CategoryModal';
import CategoryTable from './CategoryTable';
import { toast, ToastContainer } from "react-toastify";
import Pagination from '../../../Components/Pagination';
import React, { useEffect, useState } from 'react';
import api from '../../../Services/Api.js';
import ConfirmModal from '../../../Components/ConfirmModal.jsx';
import { Plus } from 'lucide-react';
import Loader from '../../../Components/Loader.jsx';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [loading,setLoading] = useState(false);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 5;

  // ConfirmModal
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [categoryToToggle, setCategoryToToggle] = useState(null);

  // Cargar categorías
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/categories", {
        params: {
          status: statusFilter || undefined,
          search: searchTerm || undefined,
          page: currentPage,
          limit: itemsPerPage,
        },
      });
      await new Promise(resolve => setTimeout(resolve, 150));
      setCategories(res.data.categories || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalItems(res.data.totalItems || 0);
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar las categorías");
    }finally{
      setLoading(false);
    }
  };

  // Crear
  const handleAddCategory = async (data) => {
    setLoading(true);
    try {
      await api.post("/admin/categories", data);
      await new Promise(resolve => setTimeout(resolve, 850));
      fetchCategories();
      setIsModalOpen(false);
      toast.success("Categoría creada");
    } catch (err) {
      console.error(err);
      toast.error("Error creando la categoría");
    }finally{
      setLoading(false);
    }
  };

  // Editar
  const handleEditCategory = async (id, data) => {
    setLoading(true);
    try {
      await api.put(`/admin/categories/${id}`, data);
      await new Promise(resolve => setTimeout(resolve, 850));  //acordarse de borralo en produccion!!!
      fetchCategories();
      setEditingCategory(null);
      setIsModalOpen(false);
      toast.success("Categoría actualizada");
    } catch (err) {
      console.error(err);
      toast.error("Error actualizando la categoría");
    }finally{
      setLoading(false)
    }
  };

  // Confirmar activación/inactivación
  const toggleCategoryStatus = async (id) => {
    setLoading(true)
    try {
      await api.patch(`/admin/categories/${id}/toggle`);
      await new Promise(resolve => setTimeout(resolve, 850));
      fetchCategories();
      toast.success("Estado de categoría actualizado");
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar estado");
    }finally{
      setLoading(false);
    }
  };

  const handleConfirmToggle = async () => {
    if (!categoryToToggle) return;
    await toggleCategoryStatus(categoryToToggle.id);
    setCategoryToToggle(null);
    setConfirmModalOpen(false);
  };

  const handleCancelToggle = () => {
    setCategoryToToggle(null);
    setConfirmModalOpen(false);
  };

  // Abre modal de confirmación
  const openConfirmModal = (category) => {
    setCategoryToToggle(category);
    setConfirmModalOpen(true);
  };

  // Cambios en búsqueda/filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    fetchCategories();
  }, [currentPage, searchTerm, statusFilter]);

  return (
    <>
      <div className="p-6">
        {loading && <Loader />}
        <h1 className="text-2xl font-bold mb-4">Gestión de Categorías</h1>
        <div className="flex justify-between items-center mb-4">
          <SearchFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
          <div className="flex gap-2">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white cursor-pointer rounded hover:bg-green-700"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Crear Categoría
            </button>
          </div>
        </div>

        <CategoryTable
          categories={categories}
          onEdit={(cat) => {
            setEditingCategory(cat);
            setIsModalOpen(true);
          }}
          onToggleStatus={openConfirmModal}
        />

        {/* Confirmación de activar/inactivar */}
        <ConfirmModal
          open={confirmModalOpen}
          onClose={handleCancelToggle}
          onConfirm={handleConfirmToggle}
          title={
            categoryToToggle?.active
              ? "Inactivar Categoría"
              : "Restaurar Categoría"
          }
          message={
            categoryToToggle
              ? categoryToToggle.active
                ? `¿Estás seguro de que deseas inactivar la categoría "${categoryToToggle.name}"?`
                : `¿Deseas restaurar la categoría "${categoryToToggle.name}"?`
              : ""
          }
        />

        {/* Paginación */}
        {categories?.length > 0 && totalPages > 1 && (
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
            />
          </div>
        )}

        <CategoryModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCategory(null);
          }}
          onSubmit={editingCategory ? handleEditCategory : handleAddCategory}
          category={editingCategory}
        />

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </>
  );
};

export default CategoriesPage;
