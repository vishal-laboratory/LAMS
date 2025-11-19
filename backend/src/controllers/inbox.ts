import { Router } from 'express';
// TODO: Replace with DB integration
let inboxMessages: any[] = [];
export const inboxRouter = Router();

inboxRouter.get('/', (req, res) => {
  res.json(inboxMessages);
});

inboxRouter.post('/', (req, res) => {
  const msg = { ...req.body, id: Date.now() };
  inboxMessages.push(msg);
  res.status(201).json(msg);
});

inboxRouter.patch('/:id', (req, res) => {
  const idx = inboxMessages.findIndex(m => m.id == req.params.id);
  if (idx === -1) return res.status(404).send('Not found');
  inboxMessages[idx] = { ...inboxMessages[idx], ...req.body };
  res.json(inboxMessages[idx]);
});
