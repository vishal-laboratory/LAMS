import React, { useEffect, useState } from 'react';
import { getProjects, postProject, patchProject, deleteProject } from '../api';

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [newName, setNewName] = useState('');
  useEffect(() => { getProjects().then(setProjects); }, []);
  return (
    <div>
      <h2>Projects Admin</h2>
      <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="New project name" />
      <button onClick={() => postProject({ name: newName }).then(() => getProjects().then(setProjects))}>Add</button>
      {projects.map(proj => (
        <div key={proj.id} style={{ border: '1px solid #ccc', margin: 8, padding: 8 }}>
          <div><b>Name:</b> {proj.name}</div>
          <button onClick={() => patchProject(proj.id, { name: proj.name + ' (edited)' }).then(() => getProjects().then(setProjects))}>Edit</button>
          <button onClick={() => deleteProject(proj.id).then(() => getProjects().then(setProjects))}>Delete</button>
        </div>
      ))}
    </div>
  );
}
