import React from 'react';
import Image from 'next/image';

const FeatureCard = ({ title, description, icon }) => {
  return (
    <div className="bg-white shadow-lg rounded p-6 text-center">
      <img src={`/assets/${icon}`} alt={`${title} Icon`} className="mx-auto w-12 h-12 mb-4" />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;
