import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import InboxPage from './pages/InboxPage';
import LicenseQueuePage from './pages/LicenseQueuePage';
import LicenseDetailPage from './pages/LicenseDetailPage';
import ProjectsAdminPage from './pages/ProjectsAdminPage';
import ActivityLogPage from './pages/ActivityLogPage';
import SheetSyncMonitorPage from './pages/SheetSyncMonitorPage';
import SystemHealthPage from './pages/SystemHealthPage';

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<InboxPage />} />
      <Route path="/queue" element={<LicenseQueuePage />} />
      <Route path="/license/:id" element={<LicenseDetailPage />} />
      <Route path="/projects" element={<ProjectsAdminPage />} />
      <Route path="/activity-log" element={<ActivityLogPage />} />
      <Route path="/sheet-sync-monitor" element={<SheetSyncMonitorPage />} />
      <Route path="/system-health" element={<SystemHealthPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
