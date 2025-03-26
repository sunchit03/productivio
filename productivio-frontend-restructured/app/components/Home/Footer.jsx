// import React from 'react';
// import styles from '../../styles/Footer.module.css';

// const Footer = () => {
//   return (
//     <footer className={`${styles.footer} bg-white py-40`}>
//       <div className="container mx-auto text-center">
//         <div className="flex justify-center space-x-8 mb-4">
//           <a href="#" className="text-purple-800 font-bold hover:text-purple-950">Products</a>
//           <a href="#" className="text-purple-800 font-bold hover:text-purple-950">Support</a>
//           <a href="#" className="text-purple-800 font-bold hover:text-purple-950">Resources</a>
//           <a href="#" className="text-purple-800 font-bold hover:text-purple-950">About</a>
//         </div>
//         <p className="text-purple-800 font-bold">&copy; 2025 Productivio. PRJ666 Group6.</p>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import React from 'react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
  const teamMembers = [
    { name: "Sunchit Singh", linkedin: "https://www.linkedin.com/in/sunchit-singh/" },
    { name: "Avni Goyal", linkedin: "https://www.linkedin.com/in/avni-goyal-586558208/" },
    { name: "Ankit Thapar", linkedin: "https://www.linkedin.com/in/ankit-thapar-417873275/" },
    { name: "Artom Zabihi", linkedin: "https://www.linkedin.com/in/artom-zabihi/" },
    { name: "Ali Mohamed Ali Ahmed Rezk", linkedin: "https://linkedin.com/in/eveadams" },
  ];

  return (
    <footer className="bg-purple-900 text-white py-16">
      <div className="container mx-auto text-center px-6">
        {/* Team Members */}
        <div className="flex flex-wrap justify-center gap-6 mb-6">
          {teamMembers.map((member, index) => (
            <a
              key={index}
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition"
            >
              <FaLinkedin className="text-xl" /> {member.name}
            </a>
          ))}
        </div>

        {/* GitHub Repo Link */}
        <div className="mb-6">
          <a
            href="https://github.com/sunchit03/PRJ666NAA-G6"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-gray-300 hover:text-white transition"
          >
            <FaGithub className="text-2xl" /> Project Repository
          </a>
        </div>

        {/* Copyright */}
        <p className="text-gray-200 text-sm">&copy; 2025 Productivio. PRJ666 Group6.</p>
      </div>
    </footer>
  );
};

export default Footer;

