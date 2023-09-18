import React from 'react';
import './style.css'
import Button from '@mui/material/Button';

const RainbowButton: React.FC = () => {
  const rainbowButtonStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    display: 'inline-block',
    padding: '19px 80px',
    cursor: 'pointer',
    border: '1px solid black'
  };

  const textStyle: React.CSSProperties = {
    background: 'linear-gradient(45deg, #ff6b6b, #ffa07a, #ffd700, #98fb98, #87ceeb, #8a2be2, #87ceeb, #98fb98, #ffd700, #ffa07a, #ff6b6b)',
    backgroundSize: '200% 100%',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    fontWeight: 'bold',
    fontSize: '20px',
    transition: 'border 0.3s ease',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    animation: 'scrollGradient 5s linear infinite',
  };

//   const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
//     const target = e.target as HTMLButtonElement;
//     target.style.border = '2px solid white';
//   };

//   const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
//     const target = e.target as HTMLButtonElement;
//     target.style.border = '2px solid transparent';
//   };

  return (
    <Button
      style={rainbowButtonStyle}
    >
      <span style={textStyle}>BUY NOW</span>
    </Button>
  );
};

export default RainbowButton;
