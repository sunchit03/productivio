import React from 'react';
import styles from '../../styles/Footer.module.css';

const Footer = () => {
  return (
    <footer className={`${styles.footer} bg-white py-40`}>
      <div className="container mx-auto text-center">
        <div className="flex justify-center space-x-8 mb-4">
          <a href="#" className="text-purple-800 font-bold hover:text-purple-950">Products</a>
          <a href="#" className="text-purple-800 font-bold hover:text-purple-950">Support</a>
          <a href="#" className="text-purple-800 font-bold hover:text-purple-950">Resources</a>
          <a href="#" className="text-purple-800 font-bold hover:text-purple-950">About</a>
        </div>
        <p className="text-purple-800 font-bold">&copy; 2025 Productivio. PRJ666 Group6.</p>
      </div>
    </footer>
  );
};

export default Footer;
