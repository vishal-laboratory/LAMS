
import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useMockApi } from '../hooks/useMockApi';
import { License, LicenseStatus } from '../types';
import Header from '../components/layout/Header';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
// FIX: Card component was used but not imported.
import Card from '../components/ui/Card';

const statusTabs: { name: string; status: LicenseStatus[] }[] = [
  { name: 'Approved / Synced', status: [LicenseStatus.APPROVED, LicenseStatus.SYNCED] },
  { name: 'Email Drafted', status: [LicenseStatus.EMAIL_DRAFTED] },
  { name: 'Awaiting Reply', status: [LicenseStatus.AWAITING_REPLY] },
  { name: 'Completed', status: [LicenseStatus.COMPLETED] },
];

const LicenseQueue: React.FC = () => {
  const { licenses: initialLicenses, getProjectById, useSSE, updateLicenseStatus } = useMockApi();
  const [licenses, setLicenses] = useState<License[]>(initialLicenses);
  const [activeTab, setActiveTab] = useState(statusTabs[0].name);

  const handleLicenseUpdate = useCallback((updatedLicense: Partial<License> & { id: number }) => {
    setLicenses(prev => prev.map(l => l.id === updatedLicense.id ? { ...l, ...updatedLicense } : l));
  }, []);

  useSSE<Partial<License> & { id: number }>('/api/stream/licenses', 'license.update', handleLicenseUpdate);
  useSSE<{ licenseId: number; sheetRowId: number }>('/api/stream/licenses', 'sheet.synced', ({ licenseId, sheetRowId }) => {
      handleLicenseUpdate({ id: licenseId, sheetRowId, lastSyncStatus: 'success' });
  });
  useSSE<{ licenseId: number; error: string }>('/api/stream/licenses', 'sheet.failed', ({ licenseId, error }) => {
      handleLicenseUpdate({ id: licenseId, lastSyncStatus: 'failed' });
  });


  const filteredLicenses = useMemo(() => {
    const selectedStatuses = statusTabs.find(t => t.name === activeTab)?.status;
    return licenses
      .filter(l => selectedStatuses?.includes(l.status))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [licenses, activeTab]);
  
  const getSyncChip = (status: License['lastSyncStatus']) => {
      switch (status) {
          case 'success': return <Badge color="green">Synced</Badge>;
          case 'failed': return <Badge color="red">Failed</Badge>;
          case 'pending': return <Badge color="yellow">Pending</Badge>;
          default: return <Badge color="gray">Unknown</Badge>;
      }
  };

  return (
    <div>
      <Header title="License Queue" />
      <div className="mb-4 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {statusTabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`${
                activeTab === tab.name
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      <Table headers={['Project', 'Machine Key', 'Validity', 'Status', 'Last Updated', 'Sheet Sync', 'Actions']}>
        {filteredLicenses.map(license => {
          const project = getProjectById(license.projectId);
          return (
            <tr key={license.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project?.name || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{license.machineKey}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {license.validityType === 'demo' ? `${license.validityDays} Days` : 'Permanent'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                 <Badge color="blue">{license.status.replace('_', ' ')}</Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(license.updatedAt).toLocaleString()}</td>
               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getSyncChip(license.lastSyncStatus)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                {license.status === LicenseStatus.SYNCED && <Button size="sm" onClick={() => updateLicenseStatus(license.id, LicenseStatus.EMAIL_DRAFTED)}>Draft Email</Button>}
                {license.status === LicenseStatus.EMAIL_DRAFTED && <Button size="sm" onClick={() => updateLicenseStatus(license.id, LicenseStatus.AWAITING_REPLY)}>Mark Sent</Button>}
                {license.status === LicenseStatus.AWAITING_REPLY && <Button size="sm" onClick={() => updateLicenseStatus(license.id, LicenseStatus.COMPLETED, { keysSharedFlag: true, keysSharedAt: new Date().toISOString() })}>Mark Keys Shared</Button>}
                <Link to={`/license/${license.id}`}><Button variant="secondary" size="sm">View Details</Button></Link>
              </td>
            </tr>
          );
        })}
      </Table>
       {filteredLicenses.length === 0 && <Card><p className="text-center text-gray-500 py-4">No licenses in this queue.</p></Card>}
    </div>
  );
};

export default LicenseQueue;
