// Shared types for frontend
export type InboxMessage = {
  id: number;
  source: string;
  chatId?: string;
  messageId?: string;
  sender: string;
  rawText: string;
  projectId?: number;
  parsedJson?: any;
  status: string;
  receivedAt?: string;
  confidence?: string;
  isDuplicate?: boolean;
};

export type License = {
  id: number;
  projectId: number;
  machineKey: string;
  cameras: number;
  vaCount: number;
  location: string;
  validityType: string;
  validityDays?: number;
  expiryDate?: string;
  status: string;
  requestedBy: string;
  approvedBy?: string;
  approvedAt?: string;
  sheetRowId?: number;
  emailThreadId?: string;
  keysSharedFlag?: boolean;
  keysSharedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  lastSyncStatus?: string;
};

export type Project = {
  id: number;
  name: string;
  sheetId?: string;
  sheetTab?: string;
  defaultDemoDays?: number;
  createdAt?: string;
};

export type AuditLog = {
  id: number;
  actor: string;
  entity: string;
  entityId: number;
  action: string;
  summary?: string;
  before?: any;
  after?: any;
  at: string;
};

export type SystemStatus = {
  service: string;
  status: string;
  details: string;
};
