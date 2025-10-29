import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import api from "../../../Services/Api.js";
import { useState,useEffect } from "react";


function UserChart() {
    const [data,setData] = useState([]);
    const fetchData = async()=>{
        try{
            const response = await api.get('/admin/customers/user-by-week',{
                withCredentials:true,
            })
            // console.log("Datos recibidos:", response.data); p/ ver lo q viene
            setData(response.data); 
    }catch(error){
        console.error("Error al obtener datos del gráfico:", error);
    }
}
    useEffect(()=>{
        console.log('componente montado')
        fetchData()
    },[]);
    return (
        <div className="w-full h-64 mb-6 bg-white pb-10 pt-5 px-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Nuevos usuarios por semana</h2>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="semana" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="usuarios" stroke="#16a34a" strokeWidth={3} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
export default UserChart;