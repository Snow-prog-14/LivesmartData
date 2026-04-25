import { mockParticipants } from '../mock/participants';
import type { Participant } from '../mock/participants';

export const getAllParticipants = (): Participant[] => {
  const localParticipantsJson = localStorage.getItem('livesmart_participants');
  const localParticipants: Participant[] = localParticipantsJson ? JSON.parse(localParticipantsJson) : [];
  
  const deletedIdsJson = localStorage.getItem('livesmart_deleted_participant_ids');
  const deletedIds: string[] = deletedIdsJson ? JSON.parse(deletedIdsJson) : [];

  // Create a map for easy override
  const participantMap = new Map<string, Participant>();

  // Add mock participants first
  mockParticipants.forEach(p => {
    if (!deletedIds.includes(p.id)) {
      participantMap.set(p.id, p);
    }
  });

  // Add/Override with local participants
  localParticipants.forEach(p => {
    if (!deletedIds.includes(p.id)) {
      participantMap.set(p.id, p);
    }
  });

  return Array.from(participantMap.values());
};
