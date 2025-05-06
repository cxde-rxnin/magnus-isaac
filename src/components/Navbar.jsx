import React, { useEffect, useState } from 'react';
import { Link as ScrollLink, Events, scrollSpy } from 'react-scroll';

const navItems = [
  { id: 'welcome', label: 'Welcome', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'profile', label: 'About', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { id: 'projects', label: 'Projects', icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z' },
  { id: 'contact', label: 'Contact', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' }
];

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    Events.scrollEvent.register('begin', () => {});
    Events.scrollEvent.register('end', () => {});
    scrollSpy.update();

    return () => {
      Events.scrollEvent.remove('begin');
      Events.scrollEvent.remove('end');
    };
  }, []);

  return (
    <nav className="fixed left-0 top-0 z-50 hidden h-screen w-[18%] flex-col justify-center space-y-10 border-r border-white/10 bg-black p-8 shadow-lg backdrop-blur-md md:flex lg:p-12">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-black/10 blur-3xl"></div>
      </div>
      
      <div className="absolute top-6 left-0 right-0 flex justify-center">
        <div>
          <div className="flex h-full w-full items-center justify-center text-xl font-bold text-white">
           Magnus Isaaac
          </div>
        </div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center space-y-8">
        {navItems.map((item) => (
          <ScrollLink
            key={item.id}
            to={item.id}
            spy={true}
            smooth={true}
            offset={-70}
            duration={500}
            onSetActive={() => setActiveSection(item.id)}
            className={`group flex w-full cursor-pointer items-center space-x-3 rounded-lg p-3 transition-all duration-300 hover:bg-white/2 hover:text-white ${activeSection === item.id ? 'bg-white/5 text-white/75' : 'text-white/20'}`}
            activeClass=""
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 transition-all duration-300 ${activeSection === item.id ? 'text-white' : 'text-white/30 group-hover:text-white/65'}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
            </svg>
            <span className={`font-medium tracking-wide ${activeSection === item.id ? 'font-semibold' : ''}`}>
              {item.label}
            </span>
            {activeSection === item.id && (
              <span className="ml-auto h-2 w-2 rounded-full bg-white"></span>
            )}
          </ScrollLink>
        ))}
      </div>
      
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <p className="text-xs text-slate-500">&copy; {new Date().getFullYear()}</p>
      </div>
    </nav>
  );
};

export default Navbar;