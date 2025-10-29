import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import api from "../../../Services/Api.js";
import { toast } from "react-toastify";


const ProductStockChart = ({ height = 300, data: propData }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        // Si no hay datos pasados por props, hacé fetch
        if (!propData) {
            const fetchData = async () => {
                try {
                    const res = await api.get("/admin/products/stock-by-category");
                    setData(res.data.data);
                } catch (err) {
                    console.error(err);
                    toast.error("Error al cargar gráfico de stock");
                }
            };
            fetchData();
        }
    }, [propData]);

    const chartData = propData || data;

    if (!chartData.length) return <p>No hay datos</p>;

    return (
        <div className="bg-white p-4 rounded shadow mb-10">
            <h2 className="text-lg font-semibold mb-4">Stock total por categoría</h2>
            <ResponsiveContainer width="100%" height={height}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="stock" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
export default ProductStockChart;