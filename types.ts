
export enum InboxStatus {
  NEW = 'new',
  PARSED = 'parsed',
  NEEDS_REVIEW = 'needs_review',
  APPROVED = 'approved',
  DISCARDED = 'discarded',
}

export enum LicenseStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  SYNCED = 'synced',
  EMAIL_DRAFTED = 'email_drafted',
  AWAITING_REPLY = 'awaiting_reply',
  COMPLETED = 'completed',
}

export enum ValidityType {
  DEMO = 'demo',
  PERMANENT = 'permanent',
}

export interface Project {
  id: number;
  name: string;
  sheetId: string;
  sheetTab: string;
  defaultDemoDays: number;
  createdAt: string;
}

export interface ParsedInfo {
  project?: string;
  machineKey?: string;
  cameras?: number;
  vaCount?: number;
  validity?: string;
  location?: string;
}

export interface InboxMessage {
  id: number;
  source: 'whatsapp' | 'manual' | 'email';
  chatId?: string;
  messageId?: string;
  sender: string;
  rawText: string;
  projectId?: number;
  parsedJson: ParsedInfo;
  status: InboxStatus;
  receivedAt: string;
  confidence: 'Parsed' | 'Needs Review';
  isDuplicate?: boolean;
}

export interface License {
  id: number;
  projectId: number;
  machineKey: string;
  cameras: number;
  vaCount: number;
  location: string;
  validityType: ValidityType;
  validityDays?: number;
  expiryDate?: string;
  status: LicenseStatus;
  requestedBy: string;
  approvedBy?: string;
  approvedAt?: string;
  sheetRowId?: number;
  emailThreadId?: string;
  keysSharedFlag: boolean;
  keysSharedAt?: string;
  createdAt: string;
  updatedAt: string;
  lastSyncStatus: 'success' | 'failed' | 'pending';
}

export interface AuditLog {
  id: number;
  actor: string;
  entity: 'inbox' | 'license' | 'project';
  entityId: number;
  action: string;
  summary: string;
  before?: Record<string, any>;
  after?: Record<string, any>;
  at: string;
}

export interface SystemStatus {
  service: 'WhatsApp Bot' | 'API' | 'Sheets' | 'DB';
  status: 'Connected' | 'Disconnected' | 'Up' | 'Error' | 'Healthy';
  details: string;
}
