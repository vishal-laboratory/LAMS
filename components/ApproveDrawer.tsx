
import React, { useState, useEffect } from 'react';
import { useMockApi } from '../hooks/useMockApi';
import { InboxMessage, Project, ValidityType } from '../types';
import Modal from './ui/Modal';
import Button from './ui/Button';

interface ApproveDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  message: InboxMessage | null;
}

const ApproveDrawer: React.FC<ApproveDrawerProps> = ({ isOpen, onClose, message }) => {
  const { projects, approveLicense } = useMockApi();
  const [formData, setFormData] = useState({
    projectId: 0,
    machineKey: '',
    cameras: 0,
    vaCount: 0,
    validityType: ValidityType.DEMO,
    demoDays: 30,
    location: '',
    requestedBy: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (message) {
      const project = projects.find(p => p.name.toLowerCase() === message.parsedJson.project?.toLowerCase());
      setFormData({
        projectId: project?.id || 0,
        machineKey: message.parsedJson.machineKey || '',
        cameras: message.parsedJson.cameras || 0,
        vaCount: message.parsedJson.vaCount || 0,
        validityType: message.parsedJson.validity?.toLowerCase().includes('perm') ? ValidityType.PERMANENT : ValidityType.DEMO,
        demoDays: project?.defaultDemoDays || 30,
        location: message.parsedJson.location || '',
        requestedBy: message.sender,
      });
    }
  }, [message, projects]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'projectId' || name === 'cameras' || name === 'vaCount' || name === 'demoDays' ? parseInt(value, 10) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;
    setIsLoading(true);
    try {
      await approveLicense({
        inboxId: message.id,
        projectId: formData.projectId,
        machineKey: formData.machineKey,
        cameras: formData.cameras,
        vaCount: formData.vaCount,
        validityType: formData.validityType,
        validityDays: formData.validityType === ValidityType.DEMO ? formData.demoDays : undefined,
        location: formData.location,
        requestedBy: formData.requestedBy,
      });
      onClose();
    } catch (error) {
      console.error('Failed to approve license:', error);
      // You can add user-facing error handling here
    } finally {
      setIsLoading(false);
    }
  };

  if (!message) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Approve Request from ${message.sender}`}>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Project</label>
            <select name="projectId" value={formData.projectId} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option value="">Select Project</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Machine Key</label>
            <input type="text" name="machineKey" value={formData.machineKey} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700">Cameras</label>
            <input type="number" name="cameras" value={formData.cameras} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700">VA Count</label>
            <input type="number" name="vaCount" value={formData.vaCount} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Validity</label>
            <select name="validityType" value={formData.validityType} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option value={ValidityType.DEMO}>Demo</option>
              <option value={ValidityType.PERMANENT}>Permanent</option>
            </select>
          </div>
          {formData.validityType === ValidityType.DEMO && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Demo Days</label>
              <input type="number" name="demoDays" value={formData.demoDays} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
          )}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
           <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Requested By</label>
            <input type="text" name="requestedBy" value={formData.requestedBy} disabled className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 sm:text-sm" />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={isLoading}>{isLoading ? 'Creating...' : 'Create License'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default ApproveDrawer;
