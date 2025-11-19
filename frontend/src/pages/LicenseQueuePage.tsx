import React, { useEffect, useState } from 'react';
import { getLicenses, patchLicense } from '../api';
import { connectWebSocket } from '../ws';

export default function LicenseQueuePage() {
  const [licenses, setLicenses] = useState<any[]>([]);
  useEffect(() => {
    getLicenses().then(setLicenses);
    const ws = connectWebSocket(event => {
      if (event.type === 'license.update') setLicenses(ls => ls.map(l => l.id === event.data.id ? { ...l, ...event.data } : l));
    });
    return () => ws.close();
  }, []);
  return (
    <div>
      <h2>License Queue</h2>
      {licenses.map(lic => (
        <div key={lic.id} style={{ border: '1px solid #ccc', margin: 8, padding: 8 }}>
          <div><b>Machine Key:</b> {lic.machineKey}</div>
          <div><b>Status:</b> {lic.status}</div>
          <button onClick={() => patchLicense(lic.id, { status: 'completed' })}>Mark Completed</button>
        </div>
      ))}
    </div>
  );
}
