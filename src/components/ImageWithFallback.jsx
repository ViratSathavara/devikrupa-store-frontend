import React, { useState } from 'react';
import { FiImage } from 'react-icons/fi';

const ImageWithFallback = ({ 
  src, 
  alt, 
  className = '', 
  fallbackClassName = '',
  showFallbackIcon = true,
  fallbackText = 'No Image'
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  if (imageError || !src) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${fallbackClassName || className}`}>
        {showFallbackIcon && (
          <FiImage className="w-8 h-8 text-gray-400" />
        )}
        {fallbackText && (
          <span className="text-gray-400 text-xs ml-2">{fallbackText}</span>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className={`absolute inset-0 bg-gray-200 flex items-center justify-center ${className}`}>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{ display: isLoading ? 'none' : 'block' }}
      />
    </div>
  );
};

export default ImageWithFallback;
