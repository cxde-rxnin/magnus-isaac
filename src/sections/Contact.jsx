import React from 'react';
import Section from '../components/Section';
import { FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';

const Contact = () => {
  const contactInfo = {
    linkedinUrl: "https://linkedin.com/in/dennis-iredia-owie",
    githubUrl: "https://github.com/IrezD",
    instaUrl: "https://instagram.com"
  };

  return (
    <Section id="contact" className='bg-black'>
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-4xl font-bold text-white md:text-5xl">
          Get In Touch
        </h2>
        
        <div className="mx-auto max-w-2xl">
          <div className="relative z-10 overflow-hidden rounded-xl border border-slate-700/50 bg-white/5 p-8 backdrop-blur-sm">
            {/* Social Links */}
            <div className="mb-10">
              <h3 className="mb-6 text-2xl font-semibold text-white">Connect With Me</h3>
              
              <div className="flex flex-wrap gap-5">
                <a 
                  href={contactInfo.linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg bg-slate-700/50 px-5 py-3 text-slate-300 transition-all hover:bg-slate-600 hover:text-white"
                >
                  <FaLinkedin className="text-xl" />
                  <span className="font-medium">LinkedIn</span>
                </a>
                
                <a 
                  href={contactInfo.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg bg-slate-700/50 px-5 py-3 text-slate-300 transition-all hover:bg-slate-600 hover:text-white"
                >
                  <FaGithub className="text-xl" />
                  <span className="font-medium">GitHub</span>
                </a>

                <a 
                  href={contactInfo.instaUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg bg-slate-700/50 px-5 py-3 text-slate-300 transition-all hover:bg-slate-600 hover:text-white"
                >
                  <FaInstagram className="text-xl" />
                  <span className="font-medium">Instagram</span>
                </a>
              </div>
            </div>
            
            {/* Quote */}
            <div className="rounded-lg border border-slate-700/30 bg-slate-800/20 p-6">
              <h4 className="mb-4 font-medium text-bwhite">Favourite Quote</h4>
              <blockquote className="relative">
                <p className="mb-4 text-2xl italic leading-relaxed text-slate-200">
                  "Find what you love and love more."
                </p>
                <footer className="text-right text-slate-400">~ Nayyirah Waheed</footer>
              </blockquote>
            </div>
            
            {/* Background Elements */}
            <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-blue-500 opacity-5 blur-3xl"></div>
            <div className="absolute -left-10 top-10 h-48 w-48 rounded-full bg-indigo-600 opacity-5 blur-3xl"></div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Contact;