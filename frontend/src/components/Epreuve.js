import React from 'react';
import { FaRunning } from 'react-icons/fa';

const Epreuve = ({ titre, date, lieu, description }) => {
    return (
        <div className="epreuve">
            <h3><FaRunning /> {titre}</h3>
            <div className="details">
                <span><strong>Date :</strong> {date}</span>
                <span><strong>Lieu :</strong> {lieu}</span>
            </div>
            <div className="description">
                {description}
            </div>
            <button>Réserver</button>
        </div>
    );
};

export default Epreuve;