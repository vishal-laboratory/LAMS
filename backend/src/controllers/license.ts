import { Router } from 'express';
let licenses: any[] = [];
export const licenseRouter = Router();

licenseRouter.get('/', (req, res) => {
  res.json(licenses);
});

licenseRouter.post('/', (req, res) => {
  const lic = { ...req.body, id: Date.now() };
  licenses.push(lic);
  res.status(201).json(lic);
});

licenseRouter.patch('/:id', (req, res) => {
  const idx = licenses.findIndex(l => l.id == req.params.id);
  if (idx === -1) return res.status(404).send('Not found');
  licenses[idx] = { ...licenses[idx], ...req.body };
  res.json(licenses[idx]);
});

licenseRouter.get('/:id', (req, res) => {
  const lic = licenses.find(l => l.id == req.params.id);
  if (!lic) return res.status(404).send('Not found');
  res.json(lic);
});
