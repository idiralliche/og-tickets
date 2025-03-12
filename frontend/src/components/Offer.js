import React from 'react';

const Offer = ({ offer }) => {
    const { name, description, price } = offer;

    return (
        <div className="offer-card" data-testid="offer">
            <h3 data-testid="offer-heading">{name}</h3>
            <p data-testid="offer-description">{description}</p>
            <p data-testid="offer-price"><strong>Prix :</strong> {price}</p>
            <button>Sélectionner l'offre {name}</button>
        </div>
    );
};

export default Offer;