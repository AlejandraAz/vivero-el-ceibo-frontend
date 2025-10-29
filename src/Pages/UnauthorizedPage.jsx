import { Link } from "react-router-dom";

const UnauthorizedPage = () => (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h1 className="text-4xl font-bold mb-4 text-red-600">403 - No autorizado</h1>
        <p className="mb-6 text-gray-600">No tenés permisos para acceder a esta página.</p>
        <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700">
            Volver al inicio
        </Link>
    </div>
);
export default UnauthorizedPage;
