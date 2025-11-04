
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Inbox from './pages/Inbox';
import LicenseQueue from './pages/LicenseQueue';
import LicenseDetail from './pages/LicenseDetail';
import NewManualEntry from './pages/NewManualEntry';
import ProjectsAdmin from './pages/ProjectsAdmin';
import SheetSyncMonitor from './pages/SheetSyncMonitor';
import EmailDrafts from './pages/EmailDrafts';
import ActivityLog from './pages/ActivityLog';
import SystemHealth from './pages/SystemHealth';
import { MockApiProvider } from './hooks/useMockApi';

const App: React.FC = () => {
  return (
    <MockApiProvider>
      <HashRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Inbox />} />
            <Route path="/queue" element={<LicenseQueue />} />
            <Route path="/license/:id" element={<LicenseDetail />} />
            <Route path="/new-manual-entry" element={<NewManualEntry />} />
            <Route path="/projects" element={<ProjectsAdmin />} />
            <Route path="/sheet-sync-monitor" element={<SheetSyncMonitor />} />
            <Route path="/email-drafts" element={<EmailDrafts />} />
            <Route path="/activity-log" element={<ActivityLog />} />
            <Route path="/system-health" element={<SystemHealth />} />
          </Routes>
        </MainLayout>
      </HashRouter>
    </MockApiProvider>
  );
};

export default App;
