import React, { useEffect, useState } from 'react';
import { getInbox, patchInbox } from '../api';
import { connectWebSocket } from '../ws';

export default function InboxPage() {
  const [messages, setMessages] = useState<any[]>([]);
  useEffect(() => {
    getInbox().then(setMessages);
    const ws = connectWebSocket(event => {
      if (event.type === 'inbox.new') setMessages(msgs => [event.data, ...msgs]);
      if (event.type === 'inbox.update') setMessages(msgs => msgs.map(m => m.id === event.data.id ? { ...m, ...event.data } : m));
    });
    return () => ws.close();
  }, []);
  return (
    <div>
      <h2>Inbox</h2>
      {messages.map(msg => (
        <div key={msg.id} style={{ border: '1px solid #ccc', margin: 8, padding: 8 }}>
          <div><b>Sender:</b> {msg.sender}</div>
          <div><b>Text:</b> {msg.rawText}</div>
          <button onClick={() => patchInbox(msg.id, { status: 'approved' })}>Approve</button>
        </div>
      ))}
    </div>
  );
}
