import React from 'react';

interface FloatingActionButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  label?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick, children, label }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-6 z-40 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      aria-label={label || "Floating Action Button"}
    >
      {children}
    </button>
  );
};
