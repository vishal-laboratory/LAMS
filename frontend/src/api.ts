import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4100/api';

export const getInbox = () => axios.get(`${API_URL}/inbox`).then(r => r.data);
export const postInbox = (data: any) => axios.post(`${API_URL}/inbox`, data).then(r => r.data);
export const patchInbox = (id: number, data: any) => axios.patch(`${API_URL}/inbox/${id}`, data).then(r => r.data);

export const getLicenses = () => axios.get(`${API_URL}/licenses`).then(r => r.data);
export const postLicense = (data: any) => axios.post(`${API_URL}/licenses`, data).then(r => r.data);
export const patchLicense = (id: number, data: any) => axios.patch(`${API_URL}/licenses/${id}`, data).then(r => r.data);
export const getLicense = (id: number) => axios.get(`${API_URL}/licenses/${id}`).then(r => r.data);

export const getProjects = () => axios.get(`${API_URL}/projects`).then(r => r.data);
export const postProject = (data: any) => axios.post(`${API_URL}/projects`, data).then(r => r.data);
export const patchProject = (id: number, data: any) => axios.patch(`${API_URL}/projects/${id}`, data).then(r => r.data);
export const deleteProject = (id: number) => axios.delete(`${API_URL}/projects/${id}`).then(r => r.data);

export const getAuditLogs = () => axios.get(`${API_URL}/audit-logs`).then(r => r.data);
export const getSystemHealth = () => axios.get(`${API_URL}/system-health`).then(r => r.data);
