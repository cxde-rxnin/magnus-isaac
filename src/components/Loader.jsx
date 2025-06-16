import React, { useState, useEffect } from 'react';

const Loader = ({ text = 'Loading...', duration = 5000 }) => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercentage((prevPercentage) => {
        if (prevPercentage >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevPercentage + 1;
      });
    }, duration / 100);

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-90">
      <span className="text-white text-lg font-semibold animate-fadeIn">{percentage}%</span>
      <span className="text-white text-lg font-semibold animate-pulse mt-2">{text}</span>
    </div>
  );
};

export default Loader; 