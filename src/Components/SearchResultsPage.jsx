import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../Services/Api";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchResults();
  }, [query]);

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data.categories);
  };

  const fetchResults = async () => {
    const params = { search: query };
    if (selectedCat) {
      params.category = selectedCat;
    }

    const res = await api.get("/products", { params });
    setProducts(res.data.products);
  };

  const handleCategoryChange = (e) => {
    setSelectedCat(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-[#6A994E] mb-4">Resultados de búsqueda para: <span className="text-black">{query}</span></h2>

      {/* Filtro por categoría */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Filtrar por categoría:</label>
        <select
          value={selectedCat || ""}
          onChange={handleCategoryChange}
          className="border rounded px-3 py-1"
        >
          <option value="">Todas</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <button
          onClick={fetchResults}
          className="ml-3 px-4 py-1 bg-[#6A994E] text-white rounded hover:bg-[#5C8545]"
        >
          Aplicar filtro
        </button>
      </div>

      {/* Productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <img
              src={product.images?.[0]?.url || "/placeholder.jpg"}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-[#6A994E]">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600">${product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResultsPage;
