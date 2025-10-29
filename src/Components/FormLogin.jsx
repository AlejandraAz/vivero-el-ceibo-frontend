import React from 'react';
import { FaHome } from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google';
import { Link} from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
// import { useForm } from 'react-hook-form';

// *****funciona pero no tiene validaciones con react-hookform

const FormLogin = ({ email, setEmail, password, setPassword, handleLogin,handleGoogleLogin }) => {

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-[#E5BA95] w-full max-w-md rounded-md shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#835D3C]">Iniciar sesión</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <div className="mb-4">
            <label className="block mb-1 text-[#835D3C]">Correo electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#B08968] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6A994E]"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1 text-[#835D3C]">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#B08968] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6A994E]"
            />
          
            <p className="text-center my-4">
              ¿No tienes cuenta?
              <Link to="/register" className="text-[#C46F1D] font-semibold hover:underline"> Registrate</Link>
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-[#6A994E] text-white font-bold py-2 px-4 rounded-3xl mb-3 cursor-pointer shadow-2xl hover:bg-green-700 transition duration-200"
          >
            Comenzar
          </button>
        </form>


        <div className="mt-4 flex items-center text-[#835D3C]">
        <hr className="flex-grow border-t-2  border-[#B08968]"/>
        <span className="mx-4 font-semibold">ó inicia sesión con</span>
        <hr className="flex-grow border-t-2 border-[#B08968]"/>
        </div>

         {/* BOTÓN DE GOOGLE */}
        <div className="mt-4 flex justify-center mb-5">
          <GoogleLogin
          size="large"
          shape="pill"
          theme="outline"
            onSuccess={handleGoogleLogin}
            onError={() => {
              alert("Error en la autenticación con Google");
            }}
          />
        </div>


        <Link to="/" className="text-center font-bold flex items-center justify-center mt-4 gap-1 text-[#835D3C]">
          Volver a Inicio<FaHome size={18} />
        </Link>
      </div>
    </div>
  );
};

export default FormLogin;
