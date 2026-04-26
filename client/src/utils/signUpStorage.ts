import { mockSignUps } from "../mock/signUps";
import type { SignUpRecord } from "../mock/signUps";

const SIGN_UPS_KEY = "livesmart_sign_ups";
const DELETED_SIGN_UP_IDS_KEY = "livesmart_deleted_sign_up_ids";

const getStoredSignUps = (): SignUpRecord[] => {
  const storedData = localStorage.getItem(SIGN_UPS_KEY);

  if (!storedData) {
    return [];
  }

  try {
    return JSON.parse(storedData) as SignUpRecord[];
  } catch {
    return [];
  }
};

const getDeletedSignUpIds = (): number[] => {
  const storedData = localStorage.getItem(DELETED_SIGN_UP_IDS_KEY);

  if (!storedData) {
    return [];
  }

  try {
    return JSON.parse(storedData) as number[];
  } catch {
    return [];
  }
};

const saveDeletedSignUpIds = (ids: number[]) => {
  localStorage.setItem(DELETED_SIGN_UP_IDS_KEY, JSON.stringify(ids));
};

export const getAllSignUps = (): SignUpRecord[] => {
  const storedSignUps = getStoredSignUps();
  const deletedIds = getDeletedSignUpIds();

  const signUpMap = new Map<number, SignUpRecord>();

  mockSignUps.forEach((record) => {
    signUpMap.set(record.id, record);
  });

  storedSignUps.forEach((record) => {
    signUpMap.set(record.id, record);
  });

  return Array.from(signUpMap.values()).filter(
    (record) => !deletedIds.includes(record.id)
  );
};

export const saveSignUps = (records: SignUpRecord[]): void => {
  localStorage.setItem(SIGN_UPS_KEY, JSON.stringify(records));
};

export const addSignUp = (record: Omit<SignUpRecord, "id">): SignUpRecord => {
  const allRecords = getAllSignUps();

  const nextId =
    allRecords.length > 0
      ? Math.max(...allRecords.map((item) => item.id)) + 1
      : 1;

  const newRecord: SignUpRecord = {
    id: nextId,
    ...record,
  };

  const storedRecords = getStoredSignUps();
  saveSignUps([...storedRecords, newRecord]);

  return newRecord;
};

export const updateSignUp = (updatedRecord: SignUpRecord): void => {
  const storedRecords = getStoredSignUps();

  const existingIndex = storedRecords.findIndex(
    (record) => record.id === updatedRecord.id
  );

  if (existingIndex >= 0) {
    storedRecords[existingIndex] = updatedRecord;
    saveSignUps(storedRecords);
    return;
  }

  saveSignUps([...storedRecords, updatedRecord]);
};

export const deleteSignUp = (id: number): void => {
  const storedRecords = getStoredSignUps();

  const updatedStoredRecords = storedRecords.filter(
    (record) => record.id !== id
  );

  saveSignUps(updatedStoredRecords);

  const deletedIds = getDeletedSignUpIds();

  if (!deletedIds.includes(id)) {
    saveDeletedSignUpIds([...deletedIds, id]);
  }
};