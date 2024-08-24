import React from 'react';
import logo from '../assets/icons/logo.svg';


function Header() {
  return (
    <div className='header'>
        <div className="icons center">
            <img src={logo} alt="Logo" />
        </div>
        <div className='title center'>
            <h1>Welcome to Stone Canyon Support</h1>
        </div>
    </div>
  )
}

export default Header