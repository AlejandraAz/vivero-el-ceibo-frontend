import React, { useEffect, useState } from 'react';
import api from '../../../Services/Api.js';
import AdminTable from './AdminTable.jsx';
import { toast, ToastContainer } from 'react-toastify';
import ConfirmModal from '../../../Components/ConfirmModal.jsx';
import Loader from "../../../Components/Loader.jsx";


const AdminsPage = () => {
    const [admins, setAdmins] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [targetStatus, setTargetStatus] = useState('');
    const [loading,setLoading] = useState(false);


    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/admins');
            await new Promise(resolve => setTimeout(resolve, 1000));
            setAdmins(res.data.admins);
        } catch (err) {
            console.error(err);
            toast.error('Error al cargar los administradores');
        }finally {
        setLoading(false); 
    }
    };

    const updateAdminStatus = async (id, newStatus) => {
        setLoading(true);
        try {
            await api.patch(`/admin/${id}/status`, { accountStatus: newStatus });
            toast.success(`Estado actualizado a ${newStatus}`);
            await fetchAdmins();
        } catch (err) {
            console.error("Error al cambiar estado del admin:", err);
            toast.error("Error al cambiar el estado");
        }finally {
        setLoading(false); 
    }
    };

    const openConfirmModal = (admin, newStatus) => {
        setSelectedAdmin(admin);
        setTargetStatus(newStatus);
        setShowModal(true);
    };


    useEffect(() => {
        fetchAdmins();
    }, []);

    return (
        <div className="p-6">
            {loading && <Loader />}
            <h1 className="text-2xl font-bold mb-4">Administradores</h1>
            <AdminTable admins={admins} refreshAdmins={fetchAdmins} openConfirmModal={openConfirmModal} updateAdminStatus={updateAdminStatus} />
            <ConfirmModal
                open={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={() => {
                    updateAdminStatus(selectedAdmin?.id, targetStatus);
                    setShowModal(false);
                }}
                title={`¿Confirmás ${targetStatus === 'bloqueado' ? 'bloquear' : 'activar'} este administrador?`}
                message={`Esta acción cambiará el estado de "${selectedAdmin?.name}".`}
            />

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default AdminsPage;
