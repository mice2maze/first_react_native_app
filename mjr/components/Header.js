//file: src/components/Header.js
import React from 'react';
import { Text, Image, Button } from 'react-native';
import logo from '../assets/splash.png';
const Header = () => {
return (
    <header>
        <Image source={logo} alt="Xcelvations Logo" height="40" />
    </header>
    );
};

export default Header;