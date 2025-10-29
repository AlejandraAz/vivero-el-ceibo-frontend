import React from 'react';
import { Lock, Unlock } from 'lucide-react';

const ToggleSwitch = ({ isActive, onToggle }) => {
    return (
        <button
            onClick={onToggle}
            className={`relative inline-flex items-center w-14 h-8 cursor-pointer rounded-full transition-colors duration-300 focus:outline-none ${isActive ? 'bg-green-500' : 'bg-[#8B5E3C]'
                }`}
        >
            <span
                className={`absolute left-1 top-1 w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center ${isActive ? 'translate-x-6' : 'translate-x-0'
                    }`}
            >
                {isActive ? <Unlock size={16} className="text-green-500" /> : <Lock size={16} className="text-bg-[#8B5E3C]" />}
            </span>
        </button>
    );
};

export default ToggleSwitch;
