import { Router } from 'express';
let auditLogs: any[] = [];
export const auditRouter = Router();

auditRouter.get('/', (req, res) => {
  res.json(auditLogs);
});
