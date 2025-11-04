
import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAVIGATION_LINKS } from '../../constants';

const Sidebar: React.FC = () => {
  return (
    <div className="flex flex-col w-64 bg-slate-800 text-slate-100">
      <div className="flex items-center justify-center h-16 border-b border-slate-700">
        <h1 className="text-2xl font-bold tracking-wider">LAMS</h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-2">
          {NAVIGATION_LINKS.map((link) => (
            <NavLink
              key={link.name}
              to={link.href}
              end
              className={({ isActive }) =>
                'flex items-center px-4 py-2 text-slate-300 transition-colors duration-200 transform rounded-md hover:bg-slate-700 hover:text-white ' +
                (isActive ? 'bg-brand-primary text-white' : '')
              }
            >
              <span className="mr-3">{link.icon}</span>
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
