import { Client, Message } from 'whatsapp-web.js';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client();
client.on('qr', qr => {
  console.log('Scan this QR code:', qr);
});

client.on('ready', () => {
  console.log('WhatsApp bot is ready');
});

client.on('message', async (msg: Message) => {
  // Simple parse logic
  const parsed = { rawText: msg.body, sender: msg.from, source: 'whatsapp' };
  await axios.post(process.env.LAMS_API_URL + '/api/inbox', parsed);
  console.log('Forwarded message to LAMS backend:', parsed);
});

client.initialize();
