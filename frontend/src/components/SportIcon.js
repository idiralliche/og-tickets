import React from 'react';
import { FaBasketballBall, FaVolleyballBall, FaSwimmer, FaRunning } from 'react-icons/fa';
import { GiKimono, GiSoccerBall } from 'react-icons/gi';

const SportIcon = ({ sport }) => {
    const sportLower = sport.toLowerCase();

    let icon;
    switch (sportLower) {
        case 'basketball':
            icon = <FaBasketballBall data-testid="sport-icon" data-icon-name="basketball" />;
            break;
        case 'judo':
            icon = <GiKimono data-testid="sport-icon" data-icon-name="judo" />;
            break;
        case 'volleyball':
            icon = <FaVolleyballBall data-testid="sport-icon" data-icon-name="volleyball" />;
            break;
        case 'football':
            icon = <GiSoccerBall data-testid="sport-icon" data-icon-name="football" />;
            break;
        case 'natation':
            icon = <FaSwimmer data-testid="sport-icon" data-icon-name="natation" />;
            break;
        default:
            icon = <FaRunning data-testid="sport-icon" data-icon-name="default" />;
            break;
    }

    return icon;
};

export default SportIcon;
