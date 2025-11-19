import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getLicense } from '../api';

export default function LicenseDetailPage() {
  const { id } = useParams();
  const [license, setLicense] = useState<any>(null);
  useEffect(() => {
    if (id) getLicense(Number(id)).then(setLicense);
  }, [id]);
  if (!license) return <div>Loading...</div>;
  return (
    <div>
      <h2>License Detail</h2>
      <pre>{JSON.stringify(license, null, 2)}</pre>
    </div>
  );
}
