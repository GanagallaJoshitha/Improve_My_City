// Fix: Implement the StatCard component to resolve syntax errors.
import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  // FIX: Added optional `small` prop to support different card sizes.
  small?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, small }) => {
  return (
    // FIX: Applied conditional classes based on the `small` prop.
    <div className={`bg-white rounded-lg shadow-md text-center ${small ? 'p-2' : 'p-4'}`}>
      <p className={`font-medium text-slate-500 ${small ? 'text-xs' : 'text-sm'}`}>{title}</p>
      <p className={`font-bold text-slate-800 ${small ? 'text-2xl' : 'text-3xl'}`}>{value}</p>
    </div>
  );
};