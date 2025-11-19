import { Router } from 'express';
export const systemRouter = Router();

systemRouter.get('/', (req, res) => {
  res.json([
    { service: 'WhatsApp Bot', status: 'Connected', details: 'Last heartbeat: ' + new Date().toLocaleTimeString() },
    { service: 'API', status: 'Up', details: 'Version: 1.0.0' },
    { service: 'Sheets', status: 'Healthy', details: 'No rate limit warnings' },
    { service: 'DB', status: 'Healthy', details: 'Size: 1.2GB / Last Backup: Today' }
  ]);
});
