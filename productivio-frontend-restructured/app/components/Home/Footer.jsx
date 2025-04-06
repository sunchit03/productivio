import React from 'react';
import Link from 'next/link'; // for client-side navigation in Next.js
import { FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-purple-900 text-white py-16">
      <div className="container mx-auto text-center px-6">

        {/* About Page Link */}
        <div className="mb-6">
          <Link href="/about" passHref>
            <span className="cursor-pointer text-gray-300 hover:text-white transition text-md">
            About Us
            </span>
          </Link>
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
        <p className="text-gray-200 text-sm">
          &copy; 2025 Productivio. PRJ666 Group 6.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
