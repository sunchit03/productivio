import React from 'react';
import styles from '../../styles/HeroSection.module.css';

const HeroSection = () => {
  return (
    <section className={`${styles.heroSection} bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 py-20 px-4`}>
      <div className="container mx-auto text-center">
        <h1 className="xxl:text-4xl sm:text-3xl font-bold text-purple-900 mb-6">
          Stay Organized, Stay Productive.
        </h1>
        <p className="xxl:text-lg sm:text-md text-purple-900 mb-8">
          Simplify your tasks, plan effectively and achieve your goals with Productivio.
        </p>
        <a
          href="/api/auth/signup"
          className="px-6 py-3 bg-purple-800 text-white rounded hover:bg-purple-900 inline-block text-center font-semibold"
        >
          Get Started
        </a>
        {/* Hero Image */}
        <div className="mt-10 flex justify-center">
          <img
            src="/assets/hero-image.png"
            alt="Task Management Dashboard"
            className="w-full max-w-4xl rounded-2xl shadow-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
