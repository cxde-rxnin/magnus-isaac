import React from 'react';

const Section = ({ id, children, className = '', bgClass = 'bg-black' }) => {
  return (
    <section 
      id={id} 
      className={`min-h-screen px-6 py-20 md:px-12 md:py-28 lg:px-20 ${bgClass} ${className}`}
    >
      <div className="mx-auto max-w-7xl">
        {children}
      </div>
    </section>
  );
};

export default Section;