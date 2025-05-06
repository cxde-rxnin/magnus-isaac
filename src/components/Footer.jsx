import React from 'react';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="border-t border-slate-700/50 bg-black px-6 py-8 text-center md:px-12 md:text-left lg:px-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:ml-[18%] md:flex-row">
        <div className="flex flex-col items-center gap-2 md:flex-row md:gap-8">
          <div className="flex items-center">
            <span className="text-sm font-medium text-slate-400">Magnus Isaac</span>
          </div>
          <span className="text-xs text-slate-500">© {year} All rights reserved</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <a 
            href="https://github.com/IrezD" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition-all duration-300 hover:bg-slate-700 hover:text-blue-400"
          >
            <FaGithub className="text-lg" />
            <span className="sr-only">GitHub</span>
          </a>
          <a 
            href="https://linkedin.com/in/isaac-ikenna" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition-all duration-300 hover:bg-slate-700 hover:text-blue-400"
          >
            <FaLinkedin className="text-lg" />
            <span className="sr-only">LinkedIn</span>
          </a>
          <a 
            href="https://linkedin.com/in/isaac-ikenna" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition-all duration-300 hover:bg-slate-700 hover:text-blue-400"
          >
            <FaInstagram className="text-lg" />
            <span className="sr-only">Instagram</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;