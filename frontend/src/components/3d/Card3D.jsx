import React, { useRef, useState } from 'react';

export const Card3D = ({ 
  children, 
  className = "", 
  maxTilt = 10, 
  scale = 1.02,
  glare = true 
}) => {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState('');
  const [glareStyle, setGlareStyle] = useState({ opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltX = ((y - centerY) / centerY) * -maxTilt;
    const tiltY = ((x - centerX) / centerX) * maxTilt;

    setTransformStyle(`perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`);

    if (glare) {
      setGlareStyle({
        opacity: 0.25,
        background: `radial-gradient(circle 180px at ${x}px ${y}px, rgba(255, 255, 255, 0.45), transparent 80%)`
      });
    }
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlareStyle({ opacity: 0 });
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.15s ease-out'
      }}
      className={`relative rounded-3xl overflow-hidden will-change-transform ${className}`}
    >
      {children}

      {/* Dynamic Cursor Specular Glare */}
      {glare && (
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-3xl"
          style={glareStyle}
        />
      )}
    </div>
  );
};
