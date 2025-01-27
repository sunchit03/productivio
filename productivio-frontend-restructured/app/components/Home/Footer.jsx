import React from 'react';
import styles from '../../styles/Footer.module.css';

const Footer = () => {
  return (
    <footer className={`${styles.footer} bg-gray-100 py-8`}>
      <div className="container mx-auto text-center">
        <div className="flex justify-center space-x-8 mb-4">
          <a href="#" className="text-gray-600 hover:text-blue-600">Products</a>
          <a href="#" className="text-gray-600 hover:text-blue-600">Support</a>
          <a href="#" className="text-gray-600 hover:text-blue-600">Resources</a>
          <a href="#" className="text-gray-600 hover:text-blue-600">About</a>
        </div>
        <p className="text-gray-500">&copy; 2025 Productivio. PRJ666 Group6.</p>
      </div>
    </footer>
  );
};

export default Footer;
