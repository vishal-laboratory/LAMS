import React, { useEffect, useState } from 'react';
import { getAuditLogs } from '../api';

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<any[]>([]);
  useEffect(() => { getAuditLogs().then(setLogs); }, []);
  return (
    <div>
      <h2>Activity Log</h2>
      <table><thead><tr><th>Time</th><th>Actor</th><th>Entity</th><th>Action</th></tr></thead><tbody>
        {logs.map(log => (
          <tr key={log.id}>
            <td>{log.at}</td>
            <td>{log.actor}</td>
            <td>{log.entity}</td>
            <td>{log.action}</td>
          </tr>
        ))}
      </tbody></table>
    </div>
  );
}
