
import React, { useState, useMemo, useCallback } from 'react';
import { useMockApi } from '../hooks/useMockApi';
import { InboxMessage, InboxStatus } from '../types';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ApproveDrawer from '../components/ApproveDrawer';

const InboxCard: React.FC<{ message: InboxMessage; onApprove: (msg: InboxMessage) => void; }> = ({ message, onApprove }) => {
    return (
        <Card className="mb-4 hover:shadow-lg transition-shadow duration-200">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold">{message.sender}</h3>
                        <Badge color={message.confidence === 'Parsed' ? 'green' : 'yellow'}>{message.confidence}</Badge>
                        {message.isDuplicate && <Badge color="red">Duplicate Key</Badge>}
                    </div>
                    <p className="text-sm text-gray-500">From: {message.parsedJson.project || 'Unknown Project'} via {message.source}</p>
                    <p className="text-sm text-gray-500">Received: {new Date(message.receivedAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                    <p className="font-mono text-sm bg-gray-100 p-1 rounded">{message.parsedJson.machineKey || 'N/A'}</p>
                </div>
            </div>
            <p className="mt-4 p-3 bg-gray-50 rounded-md text-sm font-mono whitespace-pre-wrap">{message.rawText}</p>
            <div className="mt-4 flex justify-end space-x-2">
                <Button variant="secondary" size="sm">Discard</Button>
                <Button variant="secondary" size="sm">Edit & Approve</Button>
                <Button variant="primary" size="sm" onClick={() => onApprove(message)}>Approve</Button>
            </div>
        </Card>
    );
}

const Inbox: React.FC = () => {
    const { inboxMessages, useSSE } = useMockApi();
    const [messages, setMessages] = useState<InboxMessage[]>(inboxMessages);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null);

    const handleNewMessage = useCallback((newMessage: InboxMessage) => {
        setMessages(prev => [newMessage, ...prev.filter(m => m.id !== newMessage.id)]);
    }, []);

    const handleUpdateMessage = useCallback((updatedMessage: Partial<InboxMessage> & { id: number }) => {
        setMessages(prev => prev.map(m => m.id === updatedMessage.id ? { ...m, ...updatedMessage } : m));
    }, []);

    useSSE<InboxMessage>('/api/stream/inbox', 'inbox.new', handleNewMessage);
    useSSE<Partial<InboxMessage> & { id: number }>('/api/stream/inbox', 'inbox.update', handleUpdateMessage);

    const activeMessages = useMemo(() => {
        return messages
            .filter(m => m.status === InboxStatus.PARSED || m.status === InboxStatus.NEEDS_REVIEW)
            .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
    }, [messages]);

    const handleApproveClick = (message: InboxMessage) => {
        setSelectedMessage(message);
        setIsDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
        setSelectedMessage(null);
    };

    return (
        <div>
            <Header title={`Inbox (${activeMessages.length})`} />
            <div>
                {activeMessages.length > 0 ? (
                    activeMessages.map(message => (
                        <InboxCard key={message.id} message={message} onApprove={handleApproveClick} />
                    ))
                ) : (
                    <Card>
                        <p className="text-center text-gray-500">Inbox is empty. All requests have been processed.</p>
                    </Card>
                )}
            </div>
            <ApproveDrawer
                isOpen={isDrawerOpen}
                onClose={handleDrawerClose}
                message={selectedMessage}
            />
        </div>
    );
};

export default Inbox;
