import ToggleSwitch from '../../../Components/ToggleSwitch.jsx';



const AdminTable = ({ admins, refreshAdmins, openConfirmModal, updateAdminStatus }) => {

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'activo' ? 'bloqueado' : 'activo';
        if (newStatus === 'bloqueado') {
            const admin = admins.find((a) => a.id === id);
            openConfirmModal(admin, newStatus);
        } else {
            updateAdminStatus(id, newStatus);
        }
    };


    return (
        <div className="overflow-x-auto">
            <table className="table-auto  w-full border border-gray-300 shadow">
                <thead className="bg-[#E5BA95] text-[#835D3C]">
                    <tr>
                        <th className="py-2  border">Nombre</th>
                        <th className="py-2  border">Correo</th>
                        <th className="py-2  border">Estado</th>
                        <th className="py-2  border">Rol</th>
                        <th className="py-2  border">Creado</th>
                        <th className="py-2 border">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {admins.map((admin) => (
                        <tr key={admin.id} className="text-[#4A3B30]">
                            <td className="py-2 px-2 border">{admin.name}</td>
                            <td className="py-2 px-2 border text-left">{admin.email}</td>
                            <td className="py-2  border text-center capitalize">{admin.accountStatus}</td>
                            <td className="py-2  border text-center capitalize">{admin.rol}</td>
                            <td className="py-2  border text-center">{new Date(admin.fecha_creacion).toLocaleDateString()}</td>
                            <td className="py-2 border text-center">
                                <ToggleSwitch
                                    isActive={admin.accountStatus === 'activo'}
                                    onToggle={() => handleToggleStatus(admin.id, admin.accountStatus)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminTable;
