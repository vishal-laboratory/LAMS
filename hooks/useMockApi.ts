
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { InboxMessage, License, Project, AuditLog, InboxStatus, LicenseStatus, ValidityType, SystemStatus } from '../types';

// MOCK DATA
const initialProjects: Project[] = [
    { id: 1, name: 'Project Alpha', sheetId: 'sheet-alpha-123', sheetTab: 'Licenses', defaultDemoDays: 30, createdAt: new Date().toISOString() },
    { id: 2, name: 'Project Beta', sheetId: 'sheet-beta-456', sheetTab: 'Activations', defaultDemoDays: 15, createdAt: new Date().toISOString() },
];

const initialInbox: InboxMessage[] = [
    { id: 1, source: 'whatsapp', sender: 'Operator A', rawText: 'Alpha, MK:123-ABC, CAM:4, VA:2, Perm, Location:Site 1', parsedJson: { project: 'Project Alpha', machineKey: '123-ABC', cameras: 4, vaCount: 2, validity: 'Perm', location: 'Site 1'}, status: InboxStatus.PARSED, receivedAt: new Date(Date.now() - 360000).toISOString(), confidence: 'Parsed', isDuplicate: false },
    { id: 2, source: 'whatsapp', sender: 'Operator B', rawText: 'MK:456-DEF Beta CAM:8 VA:4 30d Loc:Site 2', parsedJson: { project: 'Project Beta', machineKey: '456-DEF', cameras: 8, vaCount: 4, validity: '30d Demo', location: 'Site 2'}, status: InboxStatus.PARSED, receivedAt: new Date(Date.now() - 720000).toISOString(), confidence: 'Parsed', isDuplicate: true },
    { id: 3, source: 'whatsapp', sender: 'Operator C', rawText: 'Gamma project key needed CAM16 VA8', parsedJson: { project: 'Unknown', machineKey: 'Unknown' }, status: InboxStatus.NEEDS_REVIEW, receivedAt: new Date().toISOString(), confidence: 'Needs Review', isDuplicate: false },
];

// FIX: Added missing 'keysSharedFlag' property to license objects to match the License type.
const initialLicenses: License[] = [
    { id: 1, projectId: 2, machineKey: 'EXISTING-KEY-1', cameras: 2, vaCount: 1, location: 'HQ', validityType: ValidityType.PERMANENT, status: LicenseStatus.COMPLETED, requestedBy: 'Manual Entry', keysSharedFlag: true, keysSharedAt: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), lastSyncStatus: 'success' },
    { id: 2, projectId: 1, machineKey: '789-GHI', cameras: 16, vaCount: 8, location: 'Branch Office', validityType: ValidityType.DEMO, validityDays: 30, expiryDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(), status: LicenseStatus.APPROVED, requestedBy: 'Operator X', createdAt: new Date(Date.now() - 86400000).toISOString(), updatedAt: new Date().toISOString(), lastSyncStatus: 'success', keysSharedFlag: false },
    { id: 3, projectId: 1, machineKey: 'JKL-101', cameras: 4, vaCount: 2, location: 'Remote Site', validityType: ValidityType.PERMANENT, status: LicenseStatus.EMAIL_DRAFTED, requestedBy: 'Operator Y', createdAt: new Date(Date.now() - 172800000).toISOString(), updatedAt: new Date().toISOString(), lastSyncStatus: 'success', keysSharedFlag: false },
    { id: 4, projectId: 2, machineKey: 'MNO-202', cameras: 8, vaCount: 4, location: 'Warehouse', validityType: ValidityType.DEMO, validityDays: 15, expiryDate: new Date(Date.now() + 15 * 24 * 3600 * 1000).toISOString(), status: LicenseStatus.AWAITING_REPLY, requestedBy: 'Operator Z', createdAt: new Date(Date.now() - 259200000).toISOString(), updatedAt: new Date().toISOString(), lastSyncStatus: 'success', keysSharedFlag: false },
];

const initialAuditLogs: AuditLog[] = [
    { id: 1, actor: 'System', entity: 'inbox', entityId: 1, action: 'PARSE', summary: 'Parsed WhatsApp message from Operator A.', at: new Date().toISOString() },
    { id: 2, actor: 'System', entity: 'license', entityId: 1, action: 'CREATE', summary: 'Created new license for EXISTING-KEY-1.', at: new Date().toISOString() }
];

// Mock SSE implementation
type Listener = (event: { data: string }) => void;
class MockEventSource {
    listeners: Map<string, Set<Listener>> = new Map();

    addEventListener(event: string, listener: Listener) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)?.add(listener);
    }

    removeEventListener(event: string, listener: Listener) {
        this.listeners.get(event)?.delete(listener);
    }

    dispatchEvent(eventName: string, data: any) {
        const event = { data: JSON.stringify(data) };
        this.listeners.get(eventName)?.forEach(listener => listener(event));
    }
}

const inboxStream = new MockEventSource();
const licenseStream = new MockEventSource();

const sseService = {
    connect: (url: string) => {
        if (url.includes('inbox')) return inboxStream;
        if (url.includes('licenses')) return licenseStream;
        throw new Error('Unknown SSE endpoint');
    },
    emitInboxNew: (data: InboxMessage) => inboxStream.dispatchEvent('inbox.new', data),
    emitInboxUpdate: (data: Partial<InboxMessage> & { id: number }) => inboxStream.dispatchEvent('inbox.update', data),
    emitLicenseUpdate: (data: Partial<License> & { id: number }) => licenseStream.dispatchEvent('license.update', data),
    emitSheetSynced: (data: { licenseId: number, sheetRowId: number }) => licenseStream.dispatchEvent('sheet.synced', data),
    emitSheetFailed: (data: { licenseId: number, error: string }) => licenseStream.dispatchEvent('sheet.failed', data),
};


// API Context
interface MockApiContextType {
    projects: Project[];
    inboxMessages: InboxMessage[];
    licenses: License[];
    auditLogs: AuditLog[];
    getLicenseById: (id: number) => License | undefined;
    getProjectById: (id: number) => Project | undefined;
    approveLicense: (details: Partial<License> & { inboxId: number }) => Promise<{ licenseId: number }>;
    updateLicenseStatus: (id: number, status: LicenseStatus, details?: Partial<License>) => Promise<void>;
    addManualLicense: (details: Omit<License, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'keysSharedFlag' | 'lastSyncStatus'>) => Promise<{ licenseId: number }>;
    updateProject: (project: Project) => Promise<void>;
    addProject: (project: Omit<Project, 'id' | 'createdAt'>) => Promise<void>;
    deleteProject: (id: number) => Promise<void>;
    getSystemHealth: () => Promise<SystemStatus[]>;
    useSSE: <T,>(url: string, eventName: string, onMessage: (data: T) => void) => void;
}

const MockApiContext = createContext<MockApiContextType | undefined>(undefined);

export const MockApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [inboxMessages, setInboxMessages] = useState<InboxMessage[]>(initialInbox);
    const [licenses, setLicenses] = useState<License[]>(initialLicenses);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);

    const nextIds = useRef({
        project: Math.max(...initialProjects.map(p => p.id)) + 1,
        inbox: Math.max(...initialInbox.map(i => i.id)) + 1,
        license: Math.max(...initialLicenses.map(l => l.id)) + 1,
        audit: Math.max(...initialAuditLogs.map(a => a.id)) + 1,
    });
    
    const addAuditLog = (log: Omit<AuditLog, 'id' | 'at'>) => {
        setAuditLogs(prev => [...prev, { ...log, id: nextIds.current.audit++, at: new Date().toISOString() }]);
    };

    const approveLicense = useCallback(async (details: Partial<License> & { inboxId: number }): Promise<{ licenseId: number }> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const newLicense: License = {
                    id: nextIds.current.license++,
                    projectId: details.projectId!,
                    machineKey: details.machineKey!,
                    cameras: details.cameras!,
                    vaCount: details.vaCount!,
                    location: details.location!,
                    validityType: details.validityType!,
                    validityDays: details.validityDays,
                    expiryDate: details.validityDays ? new Date(Date.now() + details.validityDays * 24 * 3600 * 1000).toISOString() : undefined,
                    status: LicenseStatus.APPROVED,
                    requestedBy: details.requestedBy!,
                    approvedBy: 'Admin',
                    approvedAt: new Date().toISOString(),
                    keysSharedFlag: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    lastSyncStatus: 'pending'
                };
                setLicenses(prev => [...prev, newLicense]);
                setInboxMessages(prev => prev.map(msg => msg.id === details.inboxId ? { ...msg, status: InboxStatus.APPROVED } : msg));

                addAuditLog({ actor: 'Admin', entity: 'license', entityId: newLicense.id, action: 'APPROVE', summary: `Approved request from inbox #${details.inboxId}` });
                sseService.emitInboxUpdate({ id: details.inboxId, status: InboxStatus.APPROVED });
                
                // Simulate sheet sync
                setTimeout(() => {
                    const sheetRowId = Math.floor(Math.random() * 1000) + 100;
                    setLicenses(prev => prev.map(l => l.id === newLicense.id ? { ...l, status: LicenseStatus.SYNCED, sheetRowId, lastSyncStatus: 'success' } : l));
                    sseService.emitLicenseUpdate({ id: newLicense.id, status: LicenseStatus.SYNCED });
                    sseService.emitSheetSynced({ licenseId: newLicense.id, sheetRowId });
                    addAuditLog({ actor: 'System', entity: 'license', entityId: newLicense.id, action: 'SYNC', summary: `Successfully synced to Google Sheet row ${sheetRowId}` });
                }, 1500);

                resolve({ licenseId: newLicense.id });
            }, 1000);
        });
    }, []);

    const updateLicenseStatus = useCallback(async (id: number, status: LicenseStatus, details: Partial<License> = {}) => {
        return new Promise<void>(resolve => {
            setTimeout(() => {
                let updatedLicense: License | undefined;
                setLicenses(prev => prev.map(l => {
                    if (l.id === id) {
                        updatedLicense = { ...l, status, ...details, updatedAt: new Date().toISOString() };
                        return updatedLicense;
                    }
                    return l;
                }));
                if(updatedLicense) {
                    addAuditLog({ actor: 'Admin', entity: 'license', entityId: id, action: 'STATUS_UPDATE', summary: `Updated status to ${status}` });
                    sseService.emitLicenseUpdate({ id, status, ...details });
                }
                resolve();
            }, 500);
        });
    }, []);

    const addManualLicense = useCallback(async (details: Omit<License, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'keysSharedFlag' | 'lastSyncStatus'>): Promise<{ licenseId: number }> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const newLicense: License = {
                    ...details,
                    id: nextIds.current.license++,
                    status: LicenseStatus.APPROVED,
                    keysSharedFlag: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    lastSyncStatus: 'pending'
                };
                setLicenses(prev => [...prev, newLicense]);
                addAuditLog({ actor: 'Admin', entity: 'license', entityId: newLicense.id, action: 'CREATE_MANUAL', summary: `Created license for ${newLicense.machineKey} manually.` });
                
                setTimeout(() => {
                    const sheetRowId = Math.floor(Math.random() * 1000) + 100;
                    setLicenses(prev => prev.map(l => l.id === newLicense.id ? { ...l, status: LicenseStatus.SYNCED, sheetRowId, lastSyncStatus: 'success' } : l));
                    sseService.emitLicenseUpdate({ id: newLicense.id, status: LicenseStatus.SYNCED });
                    sseService.emitSheetSynced({ licenseId: newLicense.id, sheetRowId });
                }, 1500);

                resolve({ licenseId: newLicense.id });
            }, 1000);
        });
    }, []);

    const updateProject = useCallback(async (project: Project) => {
        setProjects(prev => prev.map(p => p.id === project.id ? project : p));
        addAuditLog({ actor: 'Admin', entity: 'project', entityId: project.id, action: 'UPDATE', summary: `Updated project ${project.name}` });
    }, []);

    const addProject = useCallback(async (project: Omit<Project, 'id' | 'createdAt'>) => {
        const newProject = { ...project, id: nextIds.current.project++, createdAt: new Date().toISOString() };
        setProjects(prev => [...prev, newProject]);
        addAuditLog({ actor: 'Admin', entity: 'project', entityId: newProject.id, action: 'CREATE', summary: `Created project ${newProject.name}` });
    }, []);

    const deleteProject = useCallback(async (id: number) => {
        setProjects(prev => prev.filter(p => p.id !== id));
        addAuditLog({ actor: 'Admin', entity: 'project', entityId: id, action: 'DELETE', summary: `Deleted project ID ${id}` });
    }, []);
    
    const getSystemHealth = useCallback(async (): Promise<SystemStatus[]> => {
       return [
            { service: 'WhatsApp Bot', status: 'Connected', details: `Last heartbeat: ${new Date().toLocaleTimeString()}` },
            { service: 'API', status: 'Up', details: 'Version: 1.0.0' },
            { service: 'Sheets', status: 'Healthy', details: 'No rate limit warnings' },
            { service: 'DB', status: 'Healthy', details: 'Size: 1.2GB / Last Backup: Today' },
       ];
    }, []);

    const useSSE = useCallback(<T,>(url: string, eventName: string, onMessage: (data: T) => void) => {
        useEffect(() => {
            const source = sseService.connect(url);
            const handler = (event: { data: string }) => {
                const parsedData = JSON.parse(event.data) as T;
                onMessage(parsedData);
            };
            source.addEventListener(eventName, handler);
            return () => {
                source.removeEventListener(eventName, handler);
            };
        }, [url, eventName, onMessage]);
    }, []);
    
    useEffect(() => {
        const interval = setInterval(() => {
            const newId = nextIds.current.inbox++;
            const newMsg: InboxMessage = { id: newId, source: 'whatsapp', sender: `New Operator`, rawText: `Alpha, MK:NEW-${newId}, CAM:1, VA:1, Perm, Location:Site ${newId}`, parsedJson: { project: 'Project Alpha', machineKey: `NEW-${newId}` }, status: InboxStatus.PARSED, receivedAt: new Date().toISOString(), confidence: 'Parsed', isDuplicate: false };
            setInboxMessages(prev => [newMsg, ...prev]);
            sseService.emitInboxNew(newMsg);
        }, 30000); // Add a new message every 30 seconds

        return () => clearInterval(interval);
    }, []);

    const getLicenseById = (id: number) => licenses.find(l => l.id === id);
    const getProjectById = (id: number) => projects.find(p => p.id === id);

    // FIX: Replaced JSX with React.createElement to be compatible with a .ts file extension, resolving multiple parsing errors.
    return React.createElement(MockApiContext.Provider, { value: { projects, inboxMessages, licenses, auditLogs, getLicenseById, getProjectById, approveLicense, updateLicenseStatus, addManualLicense, updateProject, addProject, deleteProject, getSystemHealth, useSSE } }, children);
};

export const useMockApi = () => {
    const context = useContext(MockApiContext);
    if (context === undefined) {
        throw new Error('useMockApi must be used within a MockApiProvider');
    }
    return context;
};
