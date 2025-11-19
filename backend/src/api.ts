import { Router } from 'express';
import { inboxRouter } from './controllers/inbox';
import { licenseRouter } from './controllers/license';
import { projectRouter } from './controllers/project';
import { auditRouter } from './controllers/audit';
import { systemRouter } from './controllers/system';

export const apiRouter = Router();
apiRouter.use('/inbox', inboxRouter);
apiRouter.use('/licenses', licenseRouter);
apiRouter.use('/projects', projectRouter);
apiRouter.use('/audit-logs', auditRouter);
apiRouter.use('/system-health', systemRouter);
