import React, { useEffect, useState } from "react";
import api from "../../../Services/Api.js";


const TopSellingProductsCard = () => {
    const [topProducts, setTopProducts] = useState([]);

    useEffect(() => {
        const fetchTopProducts = async () => {
            try {
                const { data } = await api.get("/admin/orders/top-products");
                setTopProducts(data.data.slice(0, 3)); 
            } catch (error) {
                console.error("Error al obtener productos más vendidos", error);
            }
        };

        fetchTopProducts();
    }, []);

    const maxSold = topProducts.length > 0 ? Math.max(...topProducts.map(p => Number(p.totalSold))) : 1;
    return (
        <div className="bg-white shadow-md rounded-lg p-4 w-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Productos más vendidos</h3>
            <div className="space-y-3">
                {topProducts.map((product) => (
                    <div key={product.product_name}>
                        <div className="flex justify-between mb-1">
                            <span className="text-gray-600">{product.product_name}</span>
                            <span className="text-gray-800 font-medium">{product.totalSold}</span>
                        </div>
                        <div className="w-full bg-gray-200 h-3 rounded-full">
                            <div
                                className="bg-green-500 h-3 rounded-full"
                                style={{ width: `${(Number(product.totalSold) / maxSold) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopSellingProductsCard;
