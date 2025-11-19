import { Server as HttpServer } from 'http';
import { WebSocketServer } from 'ws';

export function setupWebSocket(server: HttpServer) {
  const wss = new WebSocketServer({ server });
  wss.on('connection', ws => {
    ws.send(JSON.stringify({ type: 'connected', ts: Date.now() }));
    // TODO: Broadcast events from controllers
  });
}
