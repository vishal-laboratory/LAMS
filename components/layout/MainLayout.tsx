
import React from 'react';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-base-200">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-base-100">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
