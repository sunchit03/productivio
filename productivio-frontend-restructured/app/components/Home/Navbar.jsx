'use  client';

import React from 'react';
import Link from 'next/link';
import styles from '../../styles/Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={`${styles.navbar} bg-white shadow-md`}>
      <div className="container mx-auto px-6 flex justify-between items-center h-16">
        <div className="logo text-xl font-bold text-blue-600">Productivio</div>
        <ul className="flex space-x-8">
          <li className="text-gray-700 cursor-pointer hover:text-blue-600">Features</li>
          <li className="text-gray-700 cursor-pointer hover:text-blue-600">
            <a href="api/auth/login">
              Sign In
            </a>
          </li>
          <li className="text-gray-700 cursor-pointer hover:text-blue-600">
            <a href="api/auth/signup">
              Sign Up
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;