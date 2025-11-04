
import React, { useState } from 'react';
import { useMockApi } from '../hooks/useMockApi';
import Header from '../components/layout/Header';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Project } from '../types';

const ProjectForm: React.FC<{ project?: Project; onSave: (project: Omit<Project, 'id' | 'createdAt'> | Project) => void; onCancel: () => void; }> = ({ project, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: project?.name || '',
        sheetId: project?.sheetId || '',
        sheetTab: project?.sheetTab || '',
        defaultDemoDays: project?.defaultDemoDays || 30,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'defaultDemoDays' ? parseInt(value) || 0 : value }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(project ? { ...project, ...formData } : formData);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Project Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Sheet ID</label>
                    <input type="text" name="sheetId" value={formData.sheetId} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Sheet Tab</label>
                    <input type="text" name="sheetTab" value={formData.sheetTab} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Default Demo Days</label>
                    <input type="number" name="defaultDemoDays" value={formData.defaultDemoDays} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Save Project</Button>
            </div>
        </form>
    )
}

const ProjectsAdmin: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject } = useMockApi();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);

  const openModal = (project?: Project) => {
      setEditingProject(project);
      setIsModalOpen(true);
  }

  const closeModal = () => {
      setEditingProject(undefined);
      setIsModalOpen(false);
  }

  const handleSave = async (projectData: Omit<Project, 'id' | 'createdAt'> | Project) => {
      if ('id' in projectData) {
          await updateProject(projectData);
      } else {
          await addProject(projectData);
      }
      closeModal();
  }
  
  const handleDelete = async (id: number) => {
      if(window.confirm('Are you sure you want to delete this project?')) {
          await deleteProject(id);
      }
  }

  return (
    <div>
      <Header title="Projects (Admin)">
        <Button onClick={() => openModal()}>Add Project</Button>
      </Header>
      <Table headers={['Project Name', 'Sheet ID', 'Sheet Tab', 'Default Demo Days', 'Actions']}>
        {projects.map(project => (
          <tr key={project.id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.sheetId}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.sheetTab}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.defaultDemoDays}</td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
              <Button variant="secondary" size="sm" onClick={() => openModal(project)}>Edit</Button>
              <Button variant="danger" size="sm" onClick={() => handleDelete(project.id)}>Delete</Button>
            </td>
          </tr>
        ))}
      </Table>
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingProject ? 'Edit Project' : 'Add Project'}>
          <ProjectForm project={editingProject} onSave={handleSave} onCancel={closeModal} />
      </Modal>
    </div>
  );
};

export default ProjectsAdmin;
