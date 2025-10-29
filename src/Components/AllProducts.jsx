
import api from "../Services/Api.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProductCardAll from "./ProductCardsAll.jsx";




const AllProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.products);
      // console.log("Respuesta API:", response.data);
    } catch (error) {
      console.error('Error al cargar productos del catálogo', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="px-4 py-8">
      {/* Título */}
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#6A994E] relative inline-block">
          Nuestro Catálogo
          <span className="block h-1 w-40 bg-[#6A994E] mx-auto mt-3 rounded-full"></span>
        </h2>
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.slice(0, 8).map((item) => (
          <ProductCardAll key={item.id} product={item} />
        ))}
      </div>

      {/* Botón “Ver más” */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => navigate("/productos")}
          className="bg-[#6A994E] text-white font-bold px-6 py-3 cursor-pointer rounded flex items-center gap-2 hover:bg-[#587e3f] transition text-sm sm:text-base"
        >
          Ver más productos
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
export default AllProducts