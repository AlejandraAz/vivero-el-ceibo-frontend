import { useCart } from "../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";

const ProductCardAll = ({ product })=>{

     const { addItem } = useCart();
  const navigate = useNavigate();

  // p/buscar imagen principal
  const mainImage = product.images?.find((img) => img.is_main) || product.images?.[0];
// console.log("MAIN IMAGE:", mainImage);

    return(
        <>
        
     <div
      className="bg-[#FFF8F0] rounded-lg shadow hover:shadow-lg transition cursor-pointer flex flex-col"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <img
        src={mainImage?.url || "/placeholder.jpg"}
        alt={product.name}
        className="h-48 w-full object-cover rounded-t-lg"
      />
      <div className="flex-1 p-4 text-center">
        <h3 className="text-lg font-bold text-[#6A994E] mb-2 truncate">{product.name}</h3>
        <p className="text-[#8D6E63] font-semibold text-md">${product.price}</p>
      </div>
      <div className="p-4 pt-0 flex justify-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log('btn de agregar');
            addItem({ id_product: product.id, quantity: 1 });
          }}
          className="bg-[#DDB892] text-green-800 font-bold px-4 py-2 rounded hover:bg-[#caa87f] transition"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
        </>
    )
}
export default ProductCardAll;
