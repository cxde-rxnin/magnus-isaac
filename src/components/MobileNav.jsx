import React, { useState, useEffect } from 'react';
import { Link as ScrollLink, Events, scrollSpy } from 'react-scroll';

const navItems = [
  { id: 'welcome', label: 'Welcome', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'profile', label: 'About', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { id: 'projects', label: 'Projects', icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z' },
  { id: 'blog', label: 'Blog', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
  { id: 'contact', label: 'Contact', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' }
];

const MobileNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    Events.scrollEvent.register('begin', () => {
      setIsMenuOpen(false);
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    scrollSpy.update();

    return () => {
      Events.scrollEvent.remove('begin');
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="fixed top-0 left-0 z-50 w-full md:hidden">
      <div className={`flex items-center justify-between ${isScrolled ? 'bg-black/90 backdrop-blur-md' : 'bg-transparent'} p-4 transition-all duration-300`}>
        <div className="flex items-center">
          <div className="text-xl font-bold text-white">Magnus Isaac</div>
        </div>
        <button 
          onClick={toggleMenu}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm hover:bg-white/5 hover:text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      <div 
        className={`absolute top-full left-0 w-full overflow-hidden bg-black backdrop-blur-md transition-all duration-300 ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col py-2">
          {navItems.map((item) => (
            <ScrollLink
              key={item.id}
              to={item.id}
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              onSetActive={() => setActiveSection(item.id)}
              className={`flex items-center space-x-3 border-l-4 py-4 px-6 transition-all duration-300 ${
                activeSection === item.id
                  ? 'border-white bg-white/5 text-white'
                  : 'border-transparent text-white/20 hover:border-white/30 hover:bg-white/10'
              }`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
              </svg>
              <span>{item.label}</span>
            </ScrollLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileNav;