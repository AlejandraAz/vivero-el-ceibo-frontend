import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import api from "../../../Services/Api.js";
import { toast } from "react-toastify";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

const ProductCountChart = ({ height = 300 }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get("/admin/products/count-by-category");
                setData(res.data.data);
            } catch (err) {
                console.error(err);
                toast.error("Error al cargar conteo de productos");
            }
        };
        fetchData();
    }, []);

    return (
        <div className="bg-white p-4 rounded shadow mb-10">
            <h2 className="text-lg font-semibold mb-4">Productos por categoría</h2>
            <ResponsiveContainer width="100%" height={height}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="count"
                        nameKey="category"
                        label
                        outerRadius={height / 2 - 20}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ProductCountChart;
