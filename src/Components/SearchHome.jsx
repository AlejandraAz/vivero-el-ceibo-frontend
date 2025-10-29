
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Services/Api.js";
import { Search } from "lucide-react";
import Loader from "../Components/Loader.jsx";

function SearchHome() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Traer categorías al inicio
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  // Ejecutar búsqueda con debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchTerm.trim() || category) fetchProducts();
      else setProducts([]);
    }, 300);
    return () => clearTimeout(delay);
  }, [searchTerm, category]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products/search", {
        params: { search: searchTerm, category: category || undefined },
      });
      setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Limpiar búsqueda y categoría
  const clearFilters = () => {
    setSearchTerm("");
    setCategory("");
    setProducts([]);
  };

  return (
    <div className="p-6 flex bg-[#B08968] flex-col items-center">
      {loading && <Loader />}

      {/* Buscador y select */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-2xl mb-6">
        <div className="relative w-full sm:w-1/2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full p-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#B08968]"
            style={{ borderColor: "#E6CCB2", backgroundColor: "#F7F1EA" }}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 font-bold"
            >
              ✕
            </button>
          )}
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#B08968]"
          style={{ borderColor: "#E6CCB2", backgroundColor: "#F7F1EA" }}
        >
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        {(searchTerm || category) && (
          <button
            onClick={clearFilters}
            className="px-3 py-1 bg-[#B08968] text-white rounded hover:bg-[#835D3C]"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Contenedor de resultados */}
      {(searchTerm || category) && (
        <div
          className="flex flex-col gap-3 w-full max-w-2xl p-4 rounded-lg"
          style={{ backgroundColor: "#F7E8E3" }}
        >
          {products.length > 0 ? (
            products.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between bg-white rounded-lg shadow px-4 py-2 cursor-pointer hover:shadow-md transition"
                onClick={() => navigate(`/product/${p.id}`)}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p.images?.[0]?.url || "/placeholder.png"}
                    alt={p.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h2 className="font-semibold text-gray-800">{p.name}</h2>
                    <p className="text-[#B08968] font-bold mt-1">US$ {p.price}</p>
                  </div>
                </div>
                <div className="text-gray-400 text-xl font-bold">→</div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 font-semibold text-center mt-6">
              No se encontraron productos
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchHome;
