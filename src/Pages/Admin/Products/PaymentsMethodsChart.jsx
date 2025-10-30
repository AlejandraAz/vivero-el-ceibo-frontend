import { useEffect, useState } from "react";
import api from "../../../Services/Api.js";
import { CreditCard, CircleDollarSign } from "lucide-react";

const badgeConfig = {
    transferencia: {
        icon: <CreditCard size={20} className="mr-2" />,
        color: "bg-blue-200 text-blue-800"
    },
    "contra entrega": {
        icon: <CircleDollarSign size={20} className="mr-2" />,
        color: "bg-green-200 text-green-800"
    },
    default: {
        icon: <CreditCard size={20} className="mr-2" />,
        color: "bg-gray-200 text-gray-800"
    }
};

const PaymentMethodsCard = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get("/admin/orders/payment-methods");
                setData(res.data.data);
            } catch (error) {
                console.error("Error cargando métodos de pago", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-gray-700">
                Métodos de pago utilizados
            </h2>

            <div className="space-y-3">
                {data.map((item) => {
                    const config = badgeConfig[item.payment_method] || badgeConfig.default;

                    return (
                        <div
                            key={item.payment_method}
                            className="flex justify-between items-center"
                        >
                            <span
                                className={`flex items-center px-3 py-1 mt-8 rounded-full font-semibold capitalize ${config.color}`}
                            >
                                {config.icon}
                                {item.payment_method}
                            </span>
                            <span className="text-lg font-bold mt-8 text-gray-800">
                                {item.count}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PaymentMethodsCard;
