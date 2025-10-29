import { useState, useEffect } from "react";

const CategoryModal = ({ isOpen, onClose, onSubmit, category }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (category) {
            setName(category.name);
            setDescription(category.description || "");
        } else {
            setName("");
            setDescription("");
        }
    }, [category,isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        const data = { name, description };
        if (category) {
            onSubmit(category.id, data);
        } else {
            onSubmit(data);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#f0e7dd] bg-opacity-60  z-50">
            <div
                className="p-6 rounded shadow-2xl w-96"
                style={{ backgroundColor: "#e9cbb0" }}
            >
                <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">
                    {category ? "Editar Categoría" : "Crear Categoría"}
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                        type="text"
                        placeholder="Nombre de la categoría"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="p-2 rounded focus:outline-none"
                        style={{
                            backgroundColor: "#F0EFEB",
                            border: "1px solid #B08968",
                        }}
                    />
                    <textarea
                        placeholder="Descripción (opcional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="p-2 rounded focus:outline-none"
                        style={{
                            backgroundColor: "#F0EFEB",
                            border: "1px solid #B08968",
                        }}
                    />

                    <div className="flex justify-end gap-2 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded hover:bg-gray-400 text-gray-700 cursor-pointer"
                            style={{ backgroundColor: "#ddd" }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white font-semibold rounded hover:bg-green-700 cursor-pointer"
                            style={{ backgroundColor: "#6A994E" }}
                        >
                            {category ? "Actualizar" : "Crear"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryModal;
