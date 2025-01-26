import React from 'react';
import Navbar from './home/Navbar';
import HeroSection from './home/HeroSection';
import FeatureCard from './home/FeatureCard';
import Footer from './home/Footer';

const features = [
  {
    title: 'Organize Tasks',
    description: 'Efficiently organize your personal and professional tasks.',
    icon: 'tasks-icon.svg',
  },
  {
    title: 'Plan Effectively',
    description: 'Create schedules and meet deadlines with ease.',
    icon: 'calendar-icon.svg',
  },
  {
    title: 'Stay Focused',
    description: 'Use our tools to boost your productivity and stay on track.',
    icon: 'focus-icon.svg',
  },
];

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <section className="container mx-auto py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
          />
        ))}
      </section>
      <Footer />
    </div>
  );
};

export default HomePage;
