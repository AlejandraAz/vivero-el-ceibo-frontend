import { useState, useRef } from "react";
import api from "../Services/Api.js";


const SearchProducts = ({ onSearch }) => {
    const [search, setSearch] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef(null);


    const fetchSuggestions = async (value) => {
        if (value.trim() === "") {
            setSuggestions([]);
            return;
        }

        try {
            const res = await api.get("/api/products", {
                params: { name: value },
            });
            setSuggestions(res.data.products);
            setShowSuggestions(true);
        } catch (err) {
            console.error("Error buscando productos:", err);
        }
    };
    const handleSelect = (product) => {
        setSearch(product.name);
        setShowSuggestions(false);
        onSearch({ name: product.name, category: [] });
    };

    const handleBlur = () => {
        setTimeout(() => setShowSuggestions(false), 100); // delay para permitir click
    };
    return (
        <>
            <div className="relative w-full max-w-[450px] ">
                <input
                    maxLength={50}
                    ref={inputRef}
                    type="text"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        fetchSuggestions(e.target.value);
                    }}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    onBlur={handleBlur}
                    placeholder="Buscar producto..."
                    className="w-full p-2 border rounded-md bg-[#B08968] text-white placeholder-white border-[#DDB892] focus:outline-none focus:border-[#E6CCB2]"
                />

                {search.trim() !== "" && suggestions.length === 0 && (
                    <p className="mt-2 text-sm bg-white text-[#7c5b41] px-3 py-2 font-bold rounded shadow">
                        No se encontraron productos que coincidan con "{search}".
                    </p>
                )}

                {showSuggestions && suggestions.length > 0 && (
                    <ul className="absolute z-10 bg-[#F5EDE1] text-black w-full mt-1 max-h-60 overflow-y-auto shadow-lg rounded-md">
                        {suggestions.map((item) => (
                            <li
                                key={item.id}
                                onClick={() => handleSelect(item)}
                                className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#E6CCB2]"
                            >
                                <img
                                    src={item.imageUrl || "/img/placeholder.jpg"}
                                    alt={item.name}
                                    className="w-10 h-10 object-cover rounded"
                                />
                                <div className="flex flex-col">
                                    <span className="font-semibold">{item.name}</span>
                                    <span className="text-sm text-green-700">${item.price}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    )
}

export default SearchProducts;
