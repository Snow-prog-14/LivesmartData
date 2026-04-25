import { mockContactLogs } from '../mock/contactLogs';
import type { ContactLog } from '../mock/contactLogs';

export const getAllContactLogs = (): ContactLog[] => {
  const localLogsJson = localStorage.getItem('livesmart_contact_logs');
  const localLogs: ContactLog[] = localLogsJson ? JSON.parse(localLogsJson) : [];
  
  const deletedIdsJson = localStorage.getItem('livesmart_deleted_contact_log_ids');
  const deletedIds: string[] = deletedIdsJson ? JSON.parse(deletedIdsJson) : [];

  const all = [...mockContactLogs, ...localLogs];
  return all.filter(l => !deletedIds.includes(l.id));
};

export const getParticipantContactLogs = (participantId: string): ContactLog[] => {
  return getAllContactLogs().filter(l => l.participantId === participantId);
};
