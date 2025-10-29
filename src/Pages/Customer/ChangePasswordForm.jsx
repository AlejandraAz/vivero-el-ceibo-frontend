
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import { Lock, Eye, EyeOff } from "lucide-react";
import api from "../../Services/Api.js";

const ChangePasswordForm = ({onSuccess}) => {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleShow = (field) => {
        setShowPassword({ ...showPassword, [field]: !showPassword[field] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("La nueva contraseña y la confirmación no coinciden");
            return;
        }

        setLoading(true);
        try {
            await api.put("/customer/profile/change-password", {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });

            if (onSuccess) onSuccess();

            // Limpiar inputs
            setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Error al cambiar la contraseña");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-full sm:max-w-md mx-auto p-4 bg-white shadow rounded space-y-4"
        >
            
            <h2 className="text-lg sm:text-xl font-semibold text-green-700">
                Cambiar Contraseña
            </h2>

            {["currentPassword", "newPassword", "confirmPassword"].map((field) => (
                <div key={field} className="relative w-full">
                    <label className="block text-sm sm:text-base font-medium mb-1">
                        {field === "currentPassword"
                            ? "Contraseña actual"
                            : field === "newPassword"
                            ? "Nueva contraseña"
                            : "Confirmar contraseña"}
                    </label>
                    <input
                        type={showPassword[field] ? "text" : "password"}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        placeholder="********"
                        className="w-full border px-3 py-2 sm:pr-10 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        required
                    />
                    <div
                        className="absolute top-9 sm:right-3 right-2 cursor-pointer"
                        onClick={() => toggleShow(field)}
                    >
                        {showPassword[field] ? (
                            <EyeOff size={16} />
                        ) : (
                            <Eye size={16} />
                        )}
                    </div>
                    <Lock
                        className="absolute top-9 sm:left-3 left-2 text-gray-400"
                        size={16}
                    />
                </div>
            ))}

            <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-lg text-white font-semibold transition-colors duration-200 flex items-center justify-center gap-2 ${
                    loading
                        ? "bg-green-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 active:bg-green-800"
                }`}
            >
                {loading && (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
                {loading ? "Guardando..." : "Cambiar contraseña"}
            </button>
        </form>
    );
};

export default ChangePasswordForm;
