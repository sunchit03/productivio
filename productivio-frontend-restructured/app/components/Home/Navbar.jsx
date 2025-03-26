'use  client';

import React from 'react';
import styles from '../../styles/Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={`${styles.navbar} bg-white shadow-md`}>
      <div className="container mx-auto px-6 flex justify-between items-center h-16">
        <div>
          <img
            src="/assets/logo.png"  // Place your image in public/assets folder
            alt="logo productivio"
            className='h-14 w-44'>
          </img>
        </div>
        <ul className="flex space-x-8">
          <li className="text-purple-700 font-bold cursor-pointer hover:text-purple-900">
            <a href="/api/auth/login">
              Sign In
            </a>
          </li>
          <li className="text-purple-700 font-bold cursor-pointer hover:text-purple-900">
            <a href="/api/auth/signup">
              Sign Up
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;