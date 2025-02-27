import React from 'react';
import { FaBasketballBall, FaVolleyballBall, FaSwimmer, FaRunning } from 'react-icons/fa';
import { GiKimono, GiSoccerBall } from 'react-icons/gi';

const SportIcon = ({ sport }) => {
    const sportLower = sport.toLowerCase();

    let icon;
    switch (sportLower) {
        case 'basketball':
            icon = <FaBasketballBall />;
            break;
        case 'judo':
            icon = <GiKimono />;
            break;
        case 'volleyball':
            icon = <FaVolleyballBall />;
            break;
        case 'football':
            icon = <GiSoccerBall />;
            break;
        case 'natation':
            icon = <FaSwimmer />;
            break;
        default:
            icon = <FaRunning />;
            break;
    }

    return icon;
};

export default SportIcon;
