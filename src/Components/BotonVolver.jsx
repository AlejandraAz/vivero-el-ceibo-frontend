import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BotonVolver = () => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-green-700 hover:text-green-900 
                bg-green-100 hover:bg-green-200 cursor-pointer px-4 py-2 rounded 
                    shadow-sm transition-all duration-200"
        >
            <ArrowLeft size={20} />
            <span>Volver</span>
        </button>
    );
};

export default BotonVolver;
