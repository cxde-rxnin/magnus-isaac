import React, { useEffect } from 'react';
import Section from '../components/Section';
import { Link as ScrollLink } from 'react-scroll';
import { FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Welcome = () => {
  return (
    <Section id="welcome" className="relative flex flex-col items-center justify-center overflow-hidden pt-28 text-center md:pt-20 bg-black">
        {/* Social Icons */}
        <div className="absolute right-6 top-6 z-10 flex space-x-5 md:right-12 md:top-8 lg:right-20 hidden md:flex">
             <a href="..." className="text-xl text-slate-300 transition-all duration-300 hover:text-blue-400 hover:scale-110">
               <FaLinkedin />
             </a>
             <a href="..." className="text-xl text-slate-300 transition-all duration-300 hover:text-blue-400 hover:scale-110">
               <FaGithub />
             </a>
             <a href="..." className="text-xl text-slate-300 transition-all duration-300 hover:text-blue-400 hover:scale-110">
               <FaInstagram />
             </a>
        </div>

                    {/* Terminal Box */}
                    <div className="mx-auto mb-10 max-w-4xl rounded-lg border border-slate-700/50 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-md">
                <div className="mb-2 flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-400"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                    <div className="h-3 w-3 rounded-full bg-green-400"></div>
                </div>
                <p className="font-mono text-left text-md md:text-lg">
                    <span className="text-green-400">Welcome@user:~$</span>
                    <span className="ml-2 text-slate-100">
                         Contemporative Coder and analyst. Inspired by tough problems....<span className="ml-1 animate-pulse">▎</span>
                    </span>
                </p>
            </div>
        
        {/* Background Elements
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute left-1/4 top-1/3 h-40 w-40 rounded-full bg-blue-500 blur-3xl"></div>
          <div className="absolute right-1/4 bottom-1/3 h-40 w-40 rounded-full bg-purple-500 blur-3xl"></div>
        </div> */}
        
        {/* Main Content */}
        <div className="z-10">
            <motion.h1 
                className="mb-16 text-6xl font-black text-white sm:text-7xl md:text-8xl lg:text-9xl" 
                // style={{ textShadow: '0px 2px 20px rgba(59, 130, 246, 0.5)' }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                Magnus Isaac
            </motion.h1>
            
            {/* Button */}
            <ScrollLink
                to="profile" smooth={true} duration={500} offset={-70}
                className="group relative inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-white w-12 h-12 text-white transition-all duration-300 hover:scale-110 hover:border-blue-400 hover:text-blue-400"
            >
                <span className="relative flex items-center justify-center">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </span>
            </ScrollLink>
        </div>
    </Section>
  );
};

export default Welcome;