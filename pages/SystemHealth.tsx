
import React, { useState, useEffect } from 'react';
import { useMockApi } from '../hooks/useMockApi';
import { SystemStatus } from '../types';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';

const statusColors = {
    'Connected': 'text-green-600',
    'Up': 'text-green-600',
    'Healthy': 'text-green-600',
    'Disconnected': 'text-red-600',
    'Error': 'text-red-600',
};

const HealthCard: React.FC<{ service: string; status: string; details: string; }> = ({ service, status, details }) => (
    <Card>
        <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold">{service}</h4>
            <span className={`text-lg font-bold ${statusColors[status as keyof typeof statusColors]}`}>{status}</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">{details}</p>
    </Card>
);

const SystemHealth: React.FC = () => {
    const { getSystemHealth } = useMockApi();
    const [healthData, setHealthData] = useState<SystemStatus[]>([]);

    useEffect(() => {
        const fetchHealth = async () => {
            const data = await getSystemHealth();
            setHealthData(data);
        };
        fetchHealth();
        const interval = setInterval(fetchHealth, 5000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <Header title="System Health" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {healthData.map(item => (
                    <HealthCard key={item.service} service={item.service} status={item.status} details={item.details} />
                ))}
            </div>

            <Card>
                <h3 className="text-lg font-semibold mb-4">Recent Logs</h3>
                <div className="bg-gray-900 text-white font-mono text-sm p-4 rounded-md h-64 overflow-y-auto">
                    <p><span className="text-green-400">[INFO]</span> New WhatsApp message received from Operator A.</p>
                    <p><span className="text-green-400">[INFO]</span> Message parsed successfully. Confidence: High.</p>
                    <p><span className="text-yellow-400">[WARN]</span> Duplicate machine key '456-DEF' detected for Project Beta.</p>
                    <p><span className="text-green-400">[INFO]</span> License ID 101 approved by Admin.</p>
                    <p><span className="text-green-400">[INFO]</span> Sync to Google Sheets started for License ID 101.</p>
                    <p><span className="text-red-400">[ERROR]</span> Failed to sync License ID 99. Reason: API rate limit.</p>
                    <p><span className="text-green-400">[INFO]</span> Sync to Google Sheets successful for License ID 101.</p>
                    <p><span className="text-green-400">[INFO]</span> New manual entry created for machine key 'MANUAL-01'.</p>
                </div>
            </Card>
        </div>
    );
};

export default SystemHealth;
