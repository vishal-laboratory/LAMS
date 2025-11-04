
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMockApi } from '../hooks/useMockApi';
import { Project, ValidityType, License } from '../types';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const NewManualEntry: React.FC = () => {
  const { projects, addManualLicense, licenses } = useMockApi();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Omit<License, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'keysSharedFlag' | 'lastSyncStatus' | 'sheetRowId' | 'emailThreadId'>>({
    projectId: 0,
    machineKey: '',
    cameras: 0,
    vaCount: 0,
    validityType: ValidityType.DEMO,
    validityDays: 30,
    location: '',
    requestedBy: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setError(null);
    setFormData(prev => ({ ...prev, [name]: name === 'projectId' || name === 'cameras' || name === 'vaCount' || name === 'validityDays' ? parseInt(value, 10) || 0 : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Duplicate check
    const isDuplicate = licenses.some(l => l.projectId === formData.projectId && l.machineKey === formData.machineKey);
    if (isDuplicate) {
        setError(`A license for project ID ${formData.projectId} with machine key "${formData.machineKey}" already exists.`);
        return;
    }

    setIsLoading(true);
    try {
      const { licenseId } = await addManualLicense(formData);
      navigate(`/license/${licenseId}`);
    } catch (err) {
      setError('Failed to create license. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header title="New Manual Entry" />
      <Card>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Project *</label>
              <select name="projectId" value={formData.projectId} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option value={0} disabled>Select a Project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Machine Key *</label>
              <input type="text" name="machineKey" value={formData.machineKey} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cameras *</label>
              <input type="number" name="cameras" value={formData.cameras} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">VA Count *</label>
              <input type="number" name="vaCount" value={formData.vaCount} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Validity Type *</label>
              <select name="validityType" value={formData.validityType} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option value={ValidityType.DEMO}>Demo</option>
                <option value={ValidityType.PERMANENT}>Permanent</option>
              </select>
            </div>
            {formData.validityType === ValidityType.DEMO && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Demo Days</label>
                <input type="number" name="validityDays" value={formData.validityDays} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
            )}
             <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
             <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Requested By *</label>
                <input type="text" name="requestedBy" value={formData.requestedBy} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
          </div>
          {error && <p className="mt-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={isLoading}>{isLoading ? 'Submitting...' : 'Submit and Create License'}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default NewManualEntry;
