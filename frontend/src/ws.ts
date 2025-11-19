export function connectWebSocket(onEvent: (event: any) => void) {
  const ws = new WebSocket(import.meta.env.VITE_WS_URL || 'ws://localhost:4100');
  ws.onmessage = (msg) => {
    try {
      const data = JSON.parse(msg.data);
      onEvent(data);
    } catch {}
  };
  return ws;
}
