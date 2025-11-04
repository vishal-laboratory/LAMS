
import React from 'react';

interface BadgeProps {
  color: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
  children: React.ReactNode;
}

const badgeColorClasses = {
  blue: 'bg-blue-100 text-blue-800',
  green: 'bg-green-100 text-green-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  red: 'bg-red-100 text-red-800',
  gray: 'bg-slate-200 text-slate-800',
};

const Badge: React.FC<BadgeProps> = ({ color, children }) => {
  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badgeColorClasses[color]}`}
    >
      {children}
    </span>
  );
};

export default Badge;
