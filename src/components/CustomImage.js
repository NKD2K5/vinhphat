import React from 'react';

const CustomImage = ({ src, alt, width, height, ...props }) => {
  return (
    <img 
      src={src} 
      alt={alt || ''} 
      width={width} 
      height={height} 
      {...props} 
      style={{ 
        maxWidth: '100%', 
        height: 'auto',
        ...props.style 
      }} 
    />
  );
};

export default CustomImage;
