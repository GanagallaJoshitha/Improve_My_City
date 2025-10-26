
import React from 'react';

export const MapPinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M11.54 22.35a.75.75 0 01-1.08 0l-6.75-6.75a.75.75 0 01.02-1.06l.12-.12a.75.75 0 011.06 0l6.22 6.22 6.22-6.22a.75.75 0 011.06 0l.12.12a.75.75 0 01.02 1.06l-6.75 6.75z"
      clipRule="evenodd"
    />
    <path
      fillRule="evenodd"
      d="M12 1.5a5.25 5.25 0 00-5.25 5.25c0 3.63 2.56 8.44 5.25 11.25 2.69-2.81 5.25-7.62 5.25-11.25A5.25 5.25 0 0012 1.5zm0 7.5a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
      clipRule="evenodd"
    />
  </svg>
);
