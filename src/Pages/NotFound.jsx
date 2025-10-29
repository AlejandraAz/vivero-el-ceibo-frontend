import React from 'react';
import { Link } from 'react-router-dom';
import errorImage from '../assets/404robot.png'


const NotFound = () => {
    return (
        <>
            <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
                <img
                    src={errorImage}
                    alt="Página no encontrada"
                    className="w-full max-w-md mb-6 object-contain"
                />

                <h1 className="text-3xl font-bold text-[#835D3C] mb-2 text-center">
                    ¡Oops! Página no encontrada
                </h1>

                <p className="text-gray-600 mb-4 text-center ">
                    Parece que esta página no existe o fue movida.
                </p>

                <Link
                    to="/"
                    className="bg-[#6A994E] hover:bg-green-700 text-white font-bold cursor-pointer py-2 px-6 rounded transition duration-200"
                >
                    Volver al inicio
                </Link>
            </div>
        </>
    )
}

export default NotFound