import React, { useState, useEffect, useRef } from 'react';
import Section from '../components/Section';
import { Link as ScrollLink } from 'react-scroll';
import { FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';

const Welcome = () => {
  // For typing effect
  const [typedText, setTypedText] = useState('');
  const fullText = "Contemporative Coder and analyst. Inspired by tough problems....";
  const typingSpeed = 50; // milliseconds per character
  
  // For letter animation
  const [mounted, setMounted] = useState(false);
  const nameArray = "Magnus Isaac".split("");
  
  useEffect(() => {
    // Start typing effect
    if (typedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1));
      }, typingSpeed);
      
      return () => clearTimeout(timeout);
    }
  }, [typedText, fullText]);
  
  useEffect(() => {
    // Trigger letter animations after component mounts
    setMounted(true);
  }, []);

  return (
    <Section id="welcome" className="relative flex flex-col items-center justify-center overflow-hidden pt-28 text-center md:pt-20 bg-black">
        {/* Social Icons */}
        <div className="absolute right-6 top-6 z-10 flex space-x-5 md:right-12 md:top-8 lg:right-20 hidden md:flex">
             <a href="..." className="text-xl text-slate-300 transition-all duration-300 hover:text-purple-400 hover:scale-110">
               <FaLinkedin />
             </a>
             <a href="..." className="text-xl text-slate-300 transition-all duration-300 hover:text-purple-400 hover:scale-110">
               <FaGithub />
             </a>
             <a href="..." className="text-xl text-slate-300 transition-all duration-300 hover:text-purple-400 hover:scale-110">
               <FaInstagram />
             </a>
        </div>

        <div className="mb-16 text-6xl font-black text-white sm:text-7xl md:text-8xl lg:text-9xl flex justify-center">
          {nameArray.map((letter, index) => (
            <span
              key={index}
              className={`${letter === " " ? "w-6" : ""} ${mounted ? "animate-fadeIn" : "opacity-0 translate-y-5"}`}
              style={{
                animationDelay: `${index * 80}ms`,
                animationFillMode: 'forwards',
                opacity: 0,
                transform: 'translateY(20px)'
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* Terminal Box */}
        <div className="mx-auto mb-10 max-w-4xl rounded-lg border border-slate-700/50 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-md">
          <div className="mb-4 flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-400"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
            <div className="h-3 w-3 rounded-full bg-green-400"></div>
          </div>
          <p className="font-mono text-left text-md md:text-lg">
            <span className="text-slate-100">
              {typedText}
              <span className="ml-1 animate-pulse">▎</span>
            </span>
          </p>
        </div>
        
        {/* Button */}
        <ScrollLink
          to="contact" 
          smooth={true} 
          duration={200} 
          offset={-70}
          className="group relative inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-white w-12 h-12 text-white transition-all duration-300 hover:scale-110 hover:border-purple-400 hover:text-purple-400"
        >
          <span className="relative flex items-center justify-center">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </span>
        </ScrollLink>
    </Section>
  );
};



export default Welcome;