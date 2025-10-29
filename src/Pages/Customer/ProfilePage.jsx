import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import ProfileForm from "./ProfileForm.jsx";
import ChangePasswordForm from "./ChangePasswordForm.jsx";
import api from "../../Services/Api.js";
import { Edit2, Lock, X } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserReviews from "./UserReviews.jsx";
import CreateReviewForm from "../Customer/CreateReviewForm.jsx";

const ProfilePage = () => {
    const { user, setUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/customer/profile");
                console.log("Perfil del usuario:", res.data.profile);
                setProfile(res.data.profile);
            } catch (err) {
                console.log("Error al cargar perfil:", err);
            }
        };
        fetchProfile();
    }, []);

    if (!profile) return <p className="text-center mt-10">Cargando perfil...</p>;

    const openEditProfileModal = () => {
        setModalType("edit");
        setIsModalOpen(true);
    };

    const openChangePasswordModal = () => {
        setModalType("password");
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalType(null);
    };

    //  esta función se pasa al ProfileForm
    const handleProfileUpdated = () => {
        toast.success("Perfil actualizado correctamente!");
        closeModal();
    };

    const handlePasswordUpdated = () => {
        toast.success("Contraseña actualizada correctamente!");
        closeModal();
    };

    const openReviewModal = () => setIsReviewModalOpen(true);
    const closeReviewModal = () => setIsReviewModalOpen(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-200 to-green-300 p-6">
            <div className="mx-auto max-w-3xl bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg">
                {/* Datos del usuario */}
                <div className="flex items-center mb-6">
                    {profile?.photo ? (
                        <img
                            src={profile.photo}
                            alt="Perfil"
                            className="w-20 h-20 rounded-full mr-4 object-cover shadow-md"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-green-400 mr-4 flex items-center justify-center shadow-md">
                            <span className="text-2xl font-bold text-white">
                                {profile?.name?.[0]}
                            </span>
                        </div>
                    )}
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-green-700">{profile?.name}</h2>
                        <p className="text-gray-700 text-sm sm:text-base">{profile?.email}</p>
                    </div>
                </div>

                {/* Datos estáticos */}
                <div className="grid gap-2 text-gray-700 mb-4 text-sm sm:text-base">
                    <p><strong>Teléfono:</strong> {profile?.phone || "No registrado"}</p>
                    <p><strong>Calle:</strong> {profile?.street || "-"}</p>
                    <p><strong>Número:</strong> {profile?.streetNumber || "-"}</p>
                    <p><strong>Barrio:</strong> {profile?.neighborhood || "-"}</p>
                    <p><strong>Ciudad:</strong> {profile?.city || "-"}</p>
                    <p><strong>Código postal:</strong> {profile?.postalCode || "-"}</p>
                </div>

                {/* Botones */}
                <div className="flex flex-col sm:flex-row sm:gap-4 gap-2 mb-4">
                    <button
                        onClick={openEditProfileModal}
                        className="flex items-center justify-center cursor-pointer gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition text-sm sm:text-base"
                    >
                        <Edit2 size={16} />
                        Editar perfil
                    </button>

                    {/* Mostrar solo si el método de autenticación es "local" */}
                    {profile?.authMethod === "local" && (
                        <button
                            onClick={openChangePasswordModal}
                            className="flex items-center justify-center cursor-pointer gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition text-sm sm:text-base"
                        >
                            <Lock size={16} />
                            Cambiar contraseña
                        </button>
                    )}
                </div>

                <hr className="my-6 border-t border-gray-200" />
                {/* Sección de reseñas */}
                <UserReviews />
            </div>


            {/* Modal Edición */}
            {isModalOpen && modalType === "edit" && (
                <div className="fixed inset-0 bg-gray-300 bg-opacity-80 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg relative w-full max-w-lg">
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            <X size={24} />
                        </button>
                        <ProfileForm
                            userProfile={profile}
                            setProfile={setProfile}
                            setUser={setUser}
                            onSuccess={handleProfileUpdated}
                        />
                    </div>
                </div>
            )}

            {/* Modal Cambio Contraseña */}
            {isModalOpen && modalType === "password" && (
                <div className="fixed inset-0 bg-gray-300 bg-opacity-80 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg relative w-full max-w-lg">
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            <X size={24} />
                        </button>
                        <ChangePasswordForm onSuccess={handlePasswordUpdated} />
                    </div>
                </div>
            )}

            {/* Modal Crear Reseña */}
            {isReviewModalOpen && (
                <div className="fixed inset-0 bg-gray-300 bg-opacity-80 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg relative w-full max-w-lg">
                        <button
                            onClick={closeReviewModal}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            <X size={24} />
                        </button>
                        <CreateReviewForm  onClose={closeReviewModal} />
                    </div>
                </div>
            )}

            {/* Contenedor de Toast */}
            <ToastContainer />
        </div>
    );
};

export default ProfilePage;
