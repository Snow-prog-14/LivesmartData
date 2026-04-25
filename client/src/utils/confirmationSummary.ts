import { mockConfirmations } from '../mock/confirmations';
import type { ConfirmationRecord, ConfirmationStatus } from '../mock/confirmations';
import type { Participant } from '../mock/participants';

export const getAllConfirmations = (): ConfirmationRecord[] => {
  const localConfirmationsJson = localStorage.getItem('livesmart_confirmations');
  const localConfirmations: ConfirmationRecord[] = localConfirmationsJson ? JSON.parse(localConfirmationsJson) : [];
  
  const deletedIdsJson = localStorage.getItem('livesmart_deleted_confirmation_ids');
  const deletedIds: string[] = deletedIdsJson ? JSON.parse(deletedIdsJson) : [];

  const all = [...mockConfirmations, ...localConfirmations];
  return all.filter(c => !deletedIds.includes(c.id));
};

export const getParticipantConfirmations = (participantId: string): ConfirmationRecord[] => {
  return getAllConfirmations().filter(c => c.participantId === participantId);
};

export const getLatestConfirmation = (participantId: string): ConfirmationRecord | undefined => {
  const confirmations = getParticipantConfirmations(participantId);
  if (confirmations.length === 0) return undefined;
  
  return confirmations.reduce((prev, current) => {
    return (new Date(prev.dateConfirmation) > new Date(current.dateConfirmation)) ? prev : current;
  });
};

export const getParticipantComputedConfirmationStatus = (participant: Participant): ConfirmationStatus => {
  const latest = getLatestConfirmation(participant.id);
  if (latest) {
    return latest.confirmationStatus;
  }
  return participant.confirmationStatus;
};

export const getParticipantComputedCallStatus = (participant: Participant): string => {
  const latest = getLatestConfirmation(participant.id);
  if (latest) {
    return latest.callStatus;
  }
  return participant.callStatus;
};
