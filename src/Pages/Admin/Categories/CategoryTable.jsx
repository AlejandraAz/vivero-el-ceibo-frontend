import { Pencil, LockKeyhole, LockKeyholeOpen } from "lucide-react";

const CategoryTable = ({ categories, onEdit, onToggleStatus }) => {
    return (
        <div className="w-full overflow-x-auto">
        <table className="table-auto w-full border border-gray-300 shadow">
            <thead className=" text-[#835D3C]">
                <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2">Nombre</th>
                    <th className="border border-gray-300 p-2 text-center">Descripción</th>
                    <th className="border border-gray-300 p-2">Estado</th>
                    <th className="border border-gray-300 p-2 text-center">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {categories.length > 0 ? (
                    categories.map((cat) => (
                        <tr
                            key={cat.id}
                            className={cat.status ? "hover:bg-green-50" : "bg-gray-100 text-gray-400"}
                        >
                            <td className="border border-gray-300 p-2">{cat.name}</td>
                            <td className="border border-gray-300 p-2">
                                {cat.description || "-"}
                            </td>
                            <td className="border border-gray-300 p-2 text-center">
                                {cat.status ? "Activo" : "Inactivo"}
                            </td>
                            <td className="border border-gray-300 p-2 text-center">
                                <div className="flex justify-center gap-2">
                                <button
                                    className="p-2 rounded bg-[#C1A35D] text-white hover:bg-[#B08968] cursor-pointer"
                                    onClick={() => onEdit(cat)}
                                    title="Editar categoría"
                                >
                                    <Pencil className="w-5 h-5" />
                                </button>
                                <button
                                    className={`p-2 rounded cursor-pointer ${cat.status ? "bg-[#8B5E3C] hover:bg-[#A65F46]" : "bg-green-600 hover:bg-green-700"
                                        } text-white hover:opacity-80`}
                                    onClick={() => onToggleStatus(cat)}
                                    title={cat.status ? "Inactivar" : "Activar"}
                                >
                                    {cat.status ? (
                                        <LockKeyhole className="w-5 h-5" />
                                    ) : (
                                        <LockKeyholeOpen className="w-5 h-5" />
                                    )}
                                </button>
                                </div>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td
                            colSpan="4"
                            className="border border-gray-300 p-4 text-center font-bold text-gray-500"
                        >
                            No hay categorías disponibles
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
        </div>
    );
};

export default CategoryTable;
