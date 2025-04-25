import React from 'react';

const Logo = ({ size = 'md', variant = 'default', showText = true }) => {
  // Size classes based on the size prop
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  // Color variants
  const variantClasses = {
    default: 'text-indigo-600 dark:text-indigo-400',
    white: 'text-white',
    light: 'text-indigo-300',
    dark: 'text-indigo-800',
    blue: 'text-blue-900'
  };

  const logoSize = sizeClasses[size] || sizeClasses.md;
  const logoColor = variantClasses[variant] || variantClasses.default;
  
  // Dynamic sizing for text based on logo size
  const textSizeClass = size === 'xl' ? 'text-xl' : size === 'lg' ? 'text-lg' : size === 'sm' ? 'text-xs' : 'text-sm';
  const sloganSizeClass = size === 'xl' ? 'text-sm' : size === 'lg' ? 'text-xs' : 'text-[0.6rem]';

  return (
    <div className="flex flex-col items-center">
      {/* Logo SVG container with proper sizing */}
      <div className={`${logoSize} relative`} style={{ aspectRatio: '1/1' }}>
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          className={`w-full h-full ${logoColor}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Blue background circle for logo - only visible in blue variant */}
          {variant === 'blue' && (
            <circle cx="50" cy="50" r="50" fill="#002147" />
          )}
          
          {/* Flower/plant element on left side */}
          <path 
            d="M38 25C37 22 39 19 42 20C44 21 45 24 43 26C45 27 46 29 45 31C44 33 42 33 40 32C40 35 38 37 36 36C33 35 33 33 34 31C31 31 29 30 29 28C28 25 30 24 32 24C30 22 30 20 31 18C33 17 35 17 36 19C35 17 36 14 38 14C41 15 41 17 39 18C41 20 42 22 40 24C39 25 38 25 36 24"
            stroke={variant === 'blue' ? "white" : "currentColor"}
            strokeWidth="1.5"
            fill="none"
          />
          
          {/* Person/face profile - slightly curved for better appearance */}
          <path 
            d="M58 60C58 48 52 40 45 40C45 45 50 55 45 65"
            stroke={variant === 'blue' ? "white" : "currentColor"}
            strokeWidth="2"
            fill="none"
          />
          <path 
            d="M45 40C38 42 35 50 35 65"
            stroke={variant === 'blue' ? "white" : "currentColor"}
            strokeWidth="2"
            fill="none"
          />
          
          {/* Sound waves with curved lines */}
          <path 
            d="M65 40C70 45 73 52 73 60C73 68 70 75 65 80" 
            stroke={variant === 'blue' ? "white" : "currentColor"}
            strokeWidth="1.5"
            fill="none"
          />
          <path 
            d="M72 35C79 42 82 50 82 60C82 70 79 78 72 85" 
            stroke={variant === 'blue' ? "white" : "currentColor"}
            strokeWidth="1.5"
            fill="none"
          />
          <path 
            d="M79 30C87 38 90 48 90 60C90 72 87 82 79 90" 
            stroke={variant === 'blue' ? "white" : "currentColor"}
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>
      
      {/* Text part - AWAAZ in uppercase with proper spacing */}
      {showText && (
        <div className={`mt-1 font-bold tracking-widest ${variant === 'blue' ? 'text-white' : logoColor} ${textSizeClass}`}>
          {variant === 'blue' ? (
            // White text when on blue background
            "AWAAZ"
          ) : (
            // Regular color based on variant
            "AWAAZ"
          )}
        </div>
      )}
      
      {/* Optional slogan text - with proper alignment and size */}
      {showText && variant === 'blue' && (
        <div className={`text-blue-300 ${sloganSizeClass} tracking-wider mt-0`}>
          SLOGAN HERE
        </div>
      )}
    </div>
  );
};

export default Logo; 