import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaEnvelope, FaLock } from 'react-icons/fa'; // Importa los iconos que necesitas
import { useForm } from "react-hook-form";
import api from '../Services/Api';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const RegisterLogin = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await api.post('/auth/register', data);
      toast.success('Cuenta creada exitosamente. Ahora puedes iniciar sesión');
      reset(); // Limpiar el formulario
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al registrar usuario';
      toast.error(errorMsg);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-[#E5BA95] w-full max-w-md rounded-md shadow-md p-6">
          <h2 className="text-2xl font-bold text-center mb-6 text-[#835D3C]">Crear cuenta</h2>

          <form onSubmit={handleSubmit(onSubmit)}>

            {/* Nombre */}
            <div className="mb-4 relative ">
              <label className="block mb-1 text-[#835D3C] font-bold">Nombre completo</label>
              <div className="flex items-center border  focus-within:ring-2 focus-within:ring-[#6A994E] border-[#B08968] rounded px-3 py-2">
                <FaUser className="text-[#6A994E] mr-2" size={18} />
                <input
                  type="text"
                  placeholder="Nombre y apellido"
                  {...register('name', {
                    required: 'El nombre es obligatorio',
                    minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                    maxLength: { value: 100, message: 'Máximo 100 caracteres' },
                  })}
                  className="w-full focus:outline-none"
                />
              </div>
              {errors.name && <p className="text-sm text-[#5C2D0B] font-bold mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="mb-4 relative">
              <label className="block mb-1 text-[#835D3C] font-bold">Correo electrónico</label>
              <div className="flex items-center border   focus-within:ring-2 focus-within:ring-[#6A994E] border-[#B08968] rounded px-3 py-2">
                <FaEnvelope className="text-[#6A994E] mr-2" size={18} />
                <input
                  type="email"
                  placeholder="nombre@gmail.com"
                  {...register('email', {
                    required: 'El correo es obligatorio',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Formato de correo inválido',
                    },
                  })}
                  className="w-full focus:outline-none"
                />
              </div>
              {errors.email && <p className="text-sm text-[#5C2D0B] font-bold mt-1">{errors.email.message}</p>}
            </div>

            {/* Contraseña */}
            <div className="mb-6 relative  ">
              <label className="block mb-1 text-[#835D3C] font-bold">Contraseña</label>
              <div className="flex  focus-within:ring-2 focus-within:ring-[#6A994E]  items-center border border-[#B08968] rounded px-3 py-2">
                <FaLock className="text-[#6A994E] mr-2" size={18} />
                <input
                  type="password"
                  placeholder="Debe tener entre 8 y 15 caracteres"
                  {...register('password', {
                    required: 'La contraseña es obligatoria',
                    minLength: { value: 8, message: 'Mínimo 8 caracteres' },
                    maxLength: { value: 15, message: 'Máximo 15 caracteres' },
                  })}
                  minLength={8}
                  
                  className="w-full focus:outline-none"
                />
              </div>
              {errors.password && <p className="text-sm text-[#5C2D0B] font-bold mt-1">{errors.password.message}</p>}
              <p className="text-center my-4">
                ¿Ya tienes cuenta?
                <Link to="/login" className="text-[#C46F1D] font-semibold hover:underline"> Inicia sesión</Link>
              </p>
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-[#6A994E] text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition duration-200 ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
              {isSubmitting ? (
                <span className="flex justify-center items-center">
                  <div className="w-5 h-5 border-4 border-t-transparent border-[#fff] border-solid rounded-full animate-spin"></div>
                  <span className="ml-2">Creando cuenta...</span>
                </span>
              ) : (
                'Comenzar'
              )}
            </button>
          </form>

          {/* Volver al inicio */}
          <Link to="/" className="text-center font-bold flex items-center justify-center mt-4 gap-1 text-[#835D3C]">
            Volver a Inicio <FaHome size={18} />
          </Link>
        </div>

        {/* Toast notifications */}
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </>
  );
};

export default RegisterLogin;
