import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import api from '../../../Services/Api.js';
import { toast, ToastContainer } from 'react-toastify';
import Loader from "../../../Components/Loader.jsx";

const UserCreate = ({ token }) => {
    const [loading,setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'cliente', // cliente o admin
    });

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let endpoint = formData.role === 'admin' ? '/admin' : '/customers';
        setLoading(true);

        try {
            await api.post(endpoint, {
                name: formData.name,
                email: formData.email,
                password: formData.password,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
            });

            await new Promise(resolve => setTimeout(resolve, 1000));

            toast.success("Usuario creado correctamente");
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'cliente'
            });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error al crear usuario');
        }finally {
        setLoading(false);
    }
    };

    return (
        <>{loading && <Loader />}
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-[#E5BA95] w-full max-w-md rounded-md shadow-md p-6">
                <h2 className="text-2xl font-bold text-center mb-6 text-[#835D3C]">Crear Usuario</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1 text-[#835D3C]">Nombre completo</label>
                        <input
                            type="text"
                            name="name"
                            minLength={3}
                            maxLength={100}
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full border border-[#B08968] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6A994E]"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1 text-[#835D3C]">Correo electrónico</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full border border-[#B08968] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6A994E]"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1 text-[#835D3C]">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            minLength={8}
                            maxLength={15}
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full border border-[#B08968] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6A994E]"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1 text-[#835D3C]">Tipo de usuario</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full border cursor-pointer border-[#B08968] rounded px-3 py-2"
                        >
                            <option value="cliente">Cliente</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#6A994E] cursor-pointer text-white font-bold py-2 px-4 rounded-2xl hover:bg-green-700 transition duration-200"
                    >
                        Crear Usuario
                    </button>
                </form>

                <Link to="/admin/dashboard" className="text-center font-bold flex cursor-pointer items-center justify-center mt-4 gap-1 text-[#835D3C]">
                    Volver al Panel <FaHome size={18} />
                </Link>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
        </>
    );
};

export default UserCreate;
