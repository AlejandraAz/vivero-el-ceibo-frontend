import {
    Truck,
    ShieldCheck,
    MessageCircleQuestion,
} from "lucide-react";

const beneficios = [
    {
        icon: <Truck className="w-8 h-8 text-[#6A994E]" />,
        title: "Envío gratis en la zona",
        description: "Con compras mayores a $120.000",
    },
    {
        icon: <ShieldCheck className="w-8 h-8 text-[#6A994E]" />,
        title: "Pago seguro",
        description: "Realizá tu compra con tarjeta, efectivo o transferencia.",
    },
    {
        icon: <MessageCircleQuestion className="w-8 h-8 text-[#6A994E]" />,
        title: "¿Preguntas sobre plantas?",
        description: "Te ayudamos a elegir. ¡Escribinos por WhatsApp!",
    },
];



const Benefits = () => {
    return (
        <>
            <div className="py-10  px-4 bg-[#fefcf9]">
                <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {beneficios.map((item, index) => (
                        <div key={index} className="flex items-start gap-4">
                            <div>{item.icon}</div>
                            <div>
                                <h3 className="text-lg font-bold text-[#6A994E]">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-[#6b4f3c]">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Benefits