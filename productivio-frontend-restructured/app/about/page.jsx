'use client';

import React from 'react';
import { FaGithub, FaLinkedin, FaReact} from 'react-icons/fa';
import { SiMongodb, SiTailwindcss, SiNextdotjs } from 'react-icons/si';
import Navbar from '../components/Home/Navbar';

const contributors = [
  {
    name: "Sunchit Singh",
    role: "Project Manager",
    github: "https://github.com/sunchit03",
    linkedin: "https://www.linkedin.com/in/sunchit-singh/",
    avatar: "/assets/sunchitsingh.jpg",
    description: "Writes code, manages the team, plans the sprints—basically, if something breaks, it's probably my fault."
  },
  {
    name: "Avni Goyal",
    role: "Full-Stack Developer",
    github: "https://github.com/agoyal31",
    linkedin: "https://www.linkedin.com/in/avni-goyal-586558208/",
    avatar: "/assets/avni.jpg",
    description: "Turns caffeine into front-end magic and occasional back-end sorcery. If it works, I meant to do that."
  },
  {
    name: "Artom Zabihi",
    role: "Full-Stack Developer",
    github: "https://github.com/Artomking",
    linkedin: "https://www.linkedin.com/in/artom-zabihi/",
    avatar: "/assets/artom.png",
    description: "Balancing deadlines, debugging errors, and answering ‘when will it be done?’ at least 10 times a day."
  },
  {
    name: "Ali Rezk",
    role: "Full-Stack Developer",
    github: "https://github.com/arezk11",
    linkedin: "https://www.linkedin.com/in/ali-rezk-a50681308/",
    avatar: "/assets/ali.png",
    description: "Brews coffee, writes code, squashes bugs—sometimes in that order."
  },
  {
    name: "Ankit Thapar",
    role: "Full-Stack Developer",
    github: "https://github.com/Ankit16727",
    linkedin: "https://www.linkedin.com/in/ankit-thapar-417873275/",
    avatar: "/assets/ankitThapar.png",
    description: "Building restful systems and a restful soul—one line of code, one breath at a time."
  },
];

export default function AboutPage() {
  return (
    <>
    <Navbar />
    <section className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 py-16 px-6">
      <div className="max-w-6xl mx-auto text-gray-800">
        <h1 className="text-5xl font-extrabold text-purple-900 mb-8 text-center decoration-4">About Productivio</h1>
        <p className="text-center text-purple-900 text-lg mb-16 max-w-3xl mx-auto">
          Productivio is a modern task management app. It's built to help you stay organized, productive, and on top of your goals with ease.
        </p>

        <section className="mb-24">
          <h2 className="text-3xl font-bold mb-8 text-purple-800 text-center">Key Features</h2>
          <div className="grid xxl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-6 max-w-4xl mx-auto text-purple-900 text-center">
            <div className="bg-white rounded-lg p-4 shadow-md">📝 Create, edit, and delete daily tasks</div>
            <div className="bg-white rounded-lg p-4 shadow-md">⏰ Set due dates and priorities</div>
            <div className="bg-white rounded-lg p-4 shadow-md">📎 Upload images and PDFs to tasks</div>
            <div className="bg-white rounded-lg p-4 shadow-md">👁️ Detailed task view with file previews</div>
            <div className="bg-white rounded-lg p-4 shadow-md">🧠 MongoDB-backed user and task management</div>
            <div className="bg-white rounded-lg p-4 shadow-md">⏱️ Pomodoro Timer integration</div>
            <div className="bg-white rounded-lg p-4 shadow-md">🗓️ Task with due dates appear in integrated calendar</div>
            <div className="bg-white rounded-lg p-4 shadow-md">🔔 Recieve real time notiifcations</div>
            <div className="bg-white rounded-lg p-4 shadow-md">Create teams, share and assign tasks</div>
          </div>
        </section>

        <section className="mb-28">
          <h2 className="text-3xl font-bold mb-24 text-purple-800 text-center">Meet the Contributors</h2>
          <div className="flex flex-wrap justify-center gap-16 space-y-8">
            {contributors.map((person, index) => (
              <div key={index} className="relative w-80 bg-white rounded-2xl shadow-xl pt-16 pb-6 px-6 flex flex-col items-center text-center">
                <div className="absolute -top-12 w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden">
                  <img src={person.avatar} alt={person.name} className="w-full h-full object-cover rounded-full" />
                </div>
                <h3 className="text-xl font-bold text-purple-900 mb-2 mt-2">{person.name}</h3>
                <p className="text-lg text-purple-700 mb-2">{person.role}</p>
                <p className="text-lg text-gray-600 mb-5">{person.description}</p>
                <div className="flex justify-center space-x-4 text-lg text-blue-600">
                  <a href={person.github} target="_blank"><FaGithub size={25} className='text-black'/></a>
                  <a href={person.linkedin} target="_blank"><FaLinkedin size={25} className='text-blue-900'/></a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold mb-10 text-purple-800">Built With</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 text-5xl">
            <FaReact className='text-blue-400' title="React" />
            <SiNextdotjs title="Next.js" />
            <SiMongodb className='text-green-700' title="MongoDB" />
            <img src="/assets/aws.png" alt="aws" title="AWS S3" className='w-16' />
            <SiTailwindcss className='text-blue-400' title="Tailwind CSS" />
            <img src="/assets/auth0.png" alt="Auth0" title="Auth0" className='w-12 h-12' />
          </div>
        </section>
      </div>
    </section>
    </>
  );
}
