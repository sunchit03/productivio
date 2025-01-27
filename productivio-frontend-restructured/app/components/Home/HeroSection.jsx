import React from 'react';
import styles from '../../styles/HeroSection.module.css';

const HeroSection = () => {
  return (
    <section className={`${styles.heroSection} bg-gradient-to-r from-blue-100 to-blue-200 py-20`}>
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Stay Organized, Stay Productive.
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Simplify your tasks, plan effectively, and achieve your goals with Productivio.
        </p>
        <button className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
          Get Started
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
