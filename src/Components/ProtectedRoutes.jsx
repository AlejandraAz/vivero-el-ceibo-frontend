import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "./Loader.jsx";

const ProtectedRoutes = ({ role }) => {
    const {user,loading} = useAuth();

    if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader /></div>;
    // Si no hay usuario logueado, redirige al login
    if (!user) return <Navigate to="/login" replace/>;

    // Si el rol no coincide, redirige a su panel correspondiente
    if (role && user.rol !== role) {
        // return <Navigate to="/" replace />; 
        return <Navigate to="/unauthorized" replace/>
    }
    return <Outlet/>
}

export default ProtectedRoutes