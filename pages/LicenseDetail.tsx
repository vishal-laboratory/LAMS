
import React from 'react';
import { useParams } from 'react-router-dom';
import { useMockApi } from '../hooks/useMockApi';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
// FIX: LicenseStatus enum was used but not imported.
import { LicenseStatus } from '../types';

const LicenseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getLicenseById, getProjectById, auditLogs, updateLicenseStatus } = useMockApi();
  
  const licenseId = parseInt(id || '0', 10);
  const license = getLicenseById(licenseId);
  const project = license ? getProjectById(license.projectId) : null;
  const relatedLogs = auditLogs.filter(log => log.entity === 'license' && log.entityId === licenseId);

  if (!license || !project) {
    return (
      <div>
        <Header title="License Not Found" />
        <Card>
          <p>The license you are looking for does not exist.</p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Header title={`License: ${license.machineKey}`}>
        <div className="space-x-2">
            <Button variant="secondary" onClick={() => updateLicenseStatus(license.id, LicenseStatus.AWAITING_REPLY)}>Mark Email Sent</Button>
            <Button onClick={() => updateLicenseStatus(license.id, LicenseStatus.COMPLETED, { keysSharedFlag: true, keysSharedAt: new Date().toISOString() })}>Mark Keys Shared</Button>
        </div>
      </Header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
            <Card>
                <h3 className="text-lg font-semibold mb-4">Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Project:</strong> {project.name}</div>
                    <div><strong>Machine Key:</strong> <span className="font-mono">{license.machineKey}</span></div>
                    <div><strong>Cameras:</strong> {license.cameras}</div>
                    <div><strong>VA Count:</strong> {license.vaCount}</div>
                    <div><strong>Location:</strong> {license.location}</div>
                    <div><strong>Validity:</strong> {license.validityType === 'demo' ? `${license.validityDays} Days` : 'Permanent'}</div>
                    {license.expiryDate && <div><strong>Expiry Date:</strong> {new Date(license.expiryDate).toLocaleDateString()}</div>}
                    <div><strong>Current Status:</strong> <Badge color="blue">{license.status}</Badge></div>
                    {license.sheetRowId && <div><strong>Sheet Row ID:</strong> <Badge color="green">{license.sheetRowId}</Badge></div>}
                </div>
            </Card>
        </div>
        <div className="md:col-span-1">
             <Card>
                <h3 className="text-lg font-semibold mb-4">Timeline</h3>
                <ul className="space-y-2 text-sm">
                    <li><strong>Received:</strong> {new Date(license.createdAt).toLocaleString()}</li>
                    {license.approvedAt && <li><strong>Approved:</strong> {new Date(license.approvedAt).toLocaleString()}</li>}
                    {license.status === 'email_drafted' && <li><strong>Email Drafted:</strong> {new Date(license.updatedAt).toLocaleString()}</li>}
                    {license.status === 'awaiting_reply' && <li><strong>Email Sent:</strong> {new Date(license.updatedAt).toLocaleString()}</li>}
                    {license.keysSharedAt && <li><strong>Completed:</strong> {new Date(license.keysSharedAt).toLocaleString()}</li>}
                </ul>
             </Card>
        </div>
        <div className="md:col-span-3">
          <Card>
            <h3 className="text-lg font-semibold mb-4">Audit Trail</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left font-medium">Timestamp</th>
                            <th className="px-4 py-2 text-left font-medium">Actor</th>
                            <th className="px-4 py-2 text-left font-medium">Action</th>
                            <th className="px-4 py-2 text-left font-medium">Summary</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                    {relatedLogs.map(log => (
                        <tr key={log.id} className="border-b">
                            <td className="px-4 py-2">{new Date(log.at).toLocaleString()}</td>
                            <td className="px-4 py-2">{log.actor}</td>
                            <td className="px-4 py-2"><Badge color="gray">{log.action}</Badge></td>
                            <td className="px-4 py-2">{log.summary}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LicenseDetail;
