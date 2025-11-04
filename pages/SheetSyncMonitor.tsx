
import React from 'react';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const StatCard: React.FC<{ title: string; value: string; color: string }> = ({ title, value, color }) => (
    <Card>
        <h4 className="text-gray-500 font-medium">{title}</h4>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </Card>
);

const SheetSyncMonitor: React.FC = () => {
  const failedSyncs = [
    { licenseId: 101, machineKey: 'FAIL-KEY-01', error: 'API rate limit exceeded', lastAttempt: new Date(Date.now() - 300000).toLocaleString() },
    { licenseId: 102, machineKey: 'FAIL-KEY-02', error: 'Sheet not found', lastAttempt: new Date(Date.now() - 600000).toLocaleString() },
  ];

  return (
    <div>
      <Header title="Sheet Sync Monitor" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard title="Recent Successes" value="1,204" color="text-green-600" />
        <StatCard title="Recent Failures" value="2" color="text-red-600" />
        <StatCard title="Avg. Latency" value="1.2s" color="text-blue-600" />
        <StatCard title="Pending Retries" value="2" color="text-yellow-600" />
      </div>

      <Card>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Poison Queue / Failed Syncs</h3>
            <Button variant="danger">Retry All Failed</Button>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-2 text-left font-medium">License ID</th>
                        <th className="px-4 py-2 text-left font-medium">Machine Key</th>
                        <th className="px-4 py-2 text-left font-medium">Error</th>
                        <th className="px-4 py-2 text-left font-medium">Last Attempt</th>
                        <th className="px-4 py-2 text-right font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                {failedSyncs.map(sync => (
                    <tr key={sync.licenseId} className="border-b">
                        <td className="px-4 py-2">{sync.licenseId}</td>
                        <td className="px-4 py-2 font-mono">{sync.machineKey}</td>
                        <td className="px-4 py-2 text-red-600">{sync.error}</td>
                        <td className="px-4 py-2">{sync.lastAttempt}</td>
                        <td className="px-4 py-2 text-right">
                            <Button size="sm">Retry</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
      </Card>
    </div>
  );
};

export default SheetSyncMonitor;
