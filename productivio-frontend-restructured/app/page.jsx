'use client';

import React from 'react';
import Navbar from './components/Home/Navbar';
import HeroSection from './components/Home/HeroSection';
import FeatureCard from './components/Home/FeatureCard';
import Footer from './components/Home/Footer';
import ProductivityFeatures from './components/Home/ProductivityFeatures';

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
  {
    title: 'Collaborate Seamlessly',
    description: 'Work together with your team in real time, share tasks, and communicate efficiently.',
    icon: 'collaboration-icon.svg',
  },
  {
    title: 'Smart Reminders',
    description: 'Set intelligent reminders so you never miss a deadline, meeting, or important task.',
    icon: 'reminder-icon.svg',
  },
  {
    title: 'Track Your Progress',
    description: 'Visualize your productivity with reports, task completion stats, and streaks.',
    icon: 'progress-icon.svg',
  },
];

export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <section className="container bg-white mx-auto py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
          />
        ))}
      </section>
      <div className='p-8 bg-gradient-to-r from-blue-100 to-blue-200'>
      <ProductivityFeatures />
      </div>
      <Footer />
      </div>
  );
}