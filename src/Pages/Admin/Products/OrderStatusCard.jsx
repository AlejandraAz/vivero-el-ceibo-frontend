import React, { useEffect, useState } from "react";
import api from "../../../Services/Api.js";

const OrderStatusCards = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await api.get("/admin/orders/status-chart");
                setData(res.data.data);
            } catch (err) {
                console.error("Error obteniendo estados de pedidos:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStatus();
    }, []);

    if (loading) return <p>Cargando estados de pedidos...</p>;

    const getBadgeColor = (status) => {
        switch (status) {
            case "pendiente":
                return "bg-yellow-200 text-yellow-800";
            case "en proceso":
                return "bg-blue-200 text-blue-800";
            case "completado":
                return "bg-green-200 text-green-800";
            case "cancelado":
                return "bg-red-200 text-red-800";
            default:
                return "bg-gray-200 text-gray-800";
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-bold mb-4">Pedidos por estado</h2>
            <div className="flex flex-wrap  gap-4">
                {data.map((item) => (
                    <div key={item.status} className="p-4 rounded-lg shadow bg-gray-50 flex flex-col items-center">
                        <span className={`px-3 py-1 rounded-full font-semibold ${getBadgeColor(item.status)}`}>
                            {item.status}
                        </span>
                        <p className="mt-2 text-lg font-bold">{item.count}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderStatusCards;
