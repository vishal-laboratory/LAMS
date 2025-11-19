import { Router } from 'express';
let projects: any[] = [];
export const projectRouter = Router();

projectRouter.get('/', (req, res) => {
  res.json(projects);
});

projectRouter.post('/', (req, res) => {
  const proj = { ...req.body, id: Date.now() };
  projects.push(proj);
  res.status(201).json(proj);
});

projectRouter.patch('/:id', (req, res) => {
  const idx = projects.findIndex(p => p.id == req.params.id);
  if (idx === -1) return res.status(404).send('Not found');
  projects[idx] = { ...projects[idx], ...req.body };
  res.json(projects[idx]);
});

projectRouter.delete('/:id', (req, res) => {
  projects = projects.filter(p => p.id != req.params.id);
  res.status(204).send();
});
