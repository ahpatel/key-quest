import React, { useState, useEffect } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;
  className?: string;
  cursorClassName?: string;
}

const Typewriter: React.FC<TypewriterProps> = ({
  text,
  speed = 200, // typing speed in ms
  className = '',
  cursorClassName = 'text-purple-500',
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [displayedText, text, speed]);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span className={`inline-flex items-center ${className}`}>
      {displayedText}
      <span 
        className={`transition-opacity duration-300 ${cursorClassName} ${!showCursor ? 'opacity-0' : 'opacity-100'}`}
      >
         |
      </span>
    </span>
  );
};

export default Typewriter;
