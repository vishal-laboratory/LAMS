
import React from 'react';

interface HeaderProps {
  title: string;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, children }) => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <h2 className="text-3xl font-semibold text-gray-800">{title}</h2>
      <div>{children}</div>
    </div>
  );
};

export default Header;
