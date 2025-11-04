
import React, { useState, useMemo } from 'react';
import { useMockApi } from '../hooks/useMockApi';
import { License, LicenseStatus } from '../types';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

const EmailDrafts: React.FC = () => {
  const { licenses, getProjectById, updateLicenseStatus } = useMockApi();
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const licensesToDraft = useMemo(() => {
    return licenses.filter(l => l.status === LicenseStatus.APPROVED || l.status === LicenseStatus.SYNCED);
  }, [licenses]);

  const generateEmail = (license: License) => {
      const project = getProjectById(license.projectId);
      const subject = `License Key for ${project?.name} - Machine Key: ${license.machineKey}`;
      const body = `Hi Team,

Please find the license details for your request.

Project: ${project?.name}
Machine Key: ${license.machineKey}
Cameras: ${license.cameras}
VA Count: ${license.vaCount}
Validity: ${license.validityType === 'demo' ? `${license.validityDays} Day Demo` : 'Permanent'}
${license.expiryDate ? `Expires on: ${new Date(license.expiryDate).toLocaleDateString()}` : ''}

Let us know if you have any questions.

Thanks,
LAMS Admin`;
      return { subject, body };
  }
  
  const handleDraftClick = (license: License) => {
      setSelectedLicense(license);
      setIsModalOpen(true);
  }
  
  const handleModalClose = () => {
      setIsModalOpen(false);
      setSelectedLicense(null);
  }
  
  const handleMarkSent = async () => {
      if(selectedLicense) {
          await updateLicenseStatus(selectedLicense.id, LicenseStatus.AWAITING_REPLY);
          handleModalClose();
      }
  }
  
  const { subject, body } = selectedLicense ? generateEmail(selectedLicense) : { subject: '', body: '' };

  return (
    <div>
      <Header title="Email Drafts" />
      <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-2 text-left font-medium">Project</th>
                        <th className="px-4 py-2 text-left font-medium">Machine Key</th>
                        <th className="px-4 py-2 text-left font-medium">Requested By</th>
                        <th className="px-4 py-2 text-right font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                {licensesToDraft.map(license => {
                    const project = getProjectById(license.projectId);
                    return (
                        <tr key={license.id} className="border-b">
                            <td className="px-4 py-2">{project?.name}</td>
                            <td className="px-4 py-2 font-mono">{license.machineKey}</td>
                            <td className="px-4 py-2">{license.requestedBy}</td>
                            <td className="px-4 py-2 text-right">
                                <Button size="sm" onClick={() => handleDraftClick(license)}>Draft Email</Button>
                            </td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
            {licensesToDraft.length === 0 && <p className="text-center text-gray-500 py-4">No licenses are ready for email drafting.</p>}
          </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={handleModalClose} title="Draft Email">
          <div className="space-y-4">
              <div>
                  <label className="text-sm font-medium">Subject</label>
                  <div className="relative">
                      <textarea readOnly value={subject} className="w-full p-2 mt-1 bg-gray-100 border rounded-md font-mono text-sm" rows={2}/>
                      <Button size="sm" variant="secondary" className="absolute top-2 right-2" onClick={() => navigator.clipboard.writeText(subject)}>Copy</Button>
                  </div>
              </div>
               <div>
                  <label className="text-sm font-medium">Body</label>
                  <div className="relative">
                      <textarea readOnly value={body} className="w-full p-2 mt-1 bg-gray-100 border rounded-md font-mono text-sm" rows={12}/>
                      <Button size="sm" variant="secondary" className="absolute top-2 right-2" onClick={() => navigator.clipboard.writeText(body)}>Copy</Button>
                  </div>
              </div>
          </div>
          <div className="mt-6 flex justify-end space-x-2">
              <Button variant="secondary" onClick={handleModalClose}>Cancel</Button>
              <Button onClick={handleMarkSent}>Mark Email Sent</Button>
          </div>
      </Modal>
    </div>
  );
};

export default EmailDrafts;
