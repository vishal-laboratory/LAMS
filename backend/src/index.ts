import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import { apiRouter } from './api';
import { setupWebSocket } from './ws';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api', apiRouter);

const server = http.createServer(app);
setupWebSocket(server);

const PORT = process.env.PORT || 4100;
server.listen(PORT, () => {
  console.log(`LAMS backend running on port ${PORT}`);
});
