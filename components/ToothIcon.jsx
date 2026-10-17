import React from 'react';

export default function ToothIcon({ className = 'w-4 h-4', fill = 'currentColor' }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill={fill} 
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path 
        d="M12 2C8.5 2 6 3.8 5 6.5C4.2 8.6 4.3 11.2 5 13.5C5.8 16 6.8 20 8.5 21.5C9.5 22.3 10.8 21.5 11.2 19.8C11.5 18.5 11.8 17 12 17C12.2 17 12.5 18.5 12.8 19.8C13.2 21.5 14.5 22.3 15.5 21.5C17.2 20 18.2 16 19 13.5C19.7 11.2 19.8 8.6 19 6.5C18 3.8 15.5 2 12 2ZM8.5 6C9.3 6 10 6.7 10 7.5C10 8.3 9.3 9 8.5 9C7.7 9 7 8.3 7 7.5C7 6.7 7.7 6 8.5 6Z" 
      />
    </svg>
  );
}
