
import React from 'react';
import { useMockApi } from '../hooks/useMockApi';
import Header from '../components/layout/Header';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';

const ActivityLog: React.FC = () => {
  const { auditLogs } = useMockApi();
  const sortedLogs = [...auditLogs].sort((a,b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  return (
    <div>
      <Header title="Activity Log" />
      <div className="mb-4 p-4 bg-white rounded-lg shadow-sm flex space-x-4">
        <input type="date" className="border border-gray-300 rounded-md p-2 text-sm" />
        <select className="border border-gray-300 rounded-md p-2 text-sm">
            <option>All Projects</option>
        </select>
        <select className="border border-gray-300 rounded-md p-2 text-sm">
            <option>All Actions</option>
        </select>
        <input type="text" placeholder="Filter by Actor..." className="border border-gray-300 rounded-md p-2 text-sm" />
      </div>
      <Table headers={['Timestamp', 'Actor', 'Entity', 'Entity ID', 'Action', 'Summary']}>
        {sortedLogs.map(log => (
          <tr key={log.id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(log.at).toLocaleString()}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.actor}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.entity}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.entityId}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
                <Badge color="gray">{log.action}</Badge>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.summary}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
};

export default ActivityLog;
