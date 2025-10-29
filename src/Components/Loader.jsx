import React from 'react';
import '../css/Loader.css';

const Loader = () => {
    return (
        <div className="loader-overlay">
            <div className="loading-spinner">
                <div className="loading-spinner-inner">
                    <div className="loading-spinner-circle"></div>
                    <div className="loading-spinner-circle"></div>
                    <div className="loading-spinner-circle"></div>
                    <div className="loading-spinner-circle"></div>
                    <div className="loading-spinner-circle"></div>
                </div>
            </div>
        </div>
    );
};

export default Loader;
