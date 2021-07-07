import React from 'react';
import { Container, LoadingIcon } from './styles';

import BarberLogo from '../../assets/barber.svg';

export default () => {
    return (
        <Container>
            <BarberLogo width="100%" height="160"/>
            <LoadingIcon size="large" color="#FFF"/>
        </Container>
    );
}