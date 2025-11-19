import React, { useEffect, useState } from 'react';
import { getSystemHealth } from '../api';

export default function SystemHealthPage() {
  const [health, setHealth] = useState<any[]>([]);
  useEffect(() => { getSystemHealth().then(setHealth); }, []);
  return (
    <div>
      <h2>System Health</h2>
      <ul>
        {health.map(s => (
          <li key={s.service}><b>{s.service}:</b> {s.status} ({s.details})</li>
        ))}
      </ul>
    </div>
  );
}
