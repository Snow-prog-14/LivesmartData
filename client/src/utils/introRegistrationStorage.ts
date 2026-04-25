import { mockIntroRegistrations } from "../mock/introRegistrations";
import type { IntroRegistration } from "../mock/introRegistrations";

const INTRO_REGISTRATIONS_KEY = "livesmart_intro_registrations";
const DELETED_INTRO_REGISTRATION_IDS_KEY =
  "livesmart_deleted_intro_registration_ids";

const getStoredIntroRegistrations = (): IntroRegistration[] => {
  const storedData = localStorage.getItem(INTRO_REGISTRATIONS_KEY);

  if (!storedData) {
    return [];
  }

  try {
    return JSON.parse(storedData) as IntroRegistration[];
  } catch {
    return [];
  }
};

const getDeletedIntroRegistrationIds = (): number[] => {
  const storedData = localStorage.getItem(DELETED_INTRO_REGISTRATION_IDS_KEY);

  if (!storedData) {
    return [];
  }

  try {
    return JSON.parse(storedData) as number[];
  } catch {
    return [];
  }
};

const saveDeletedIntroRegistrationIds = (ids: number[]) => {
  localStorage.setItem(DELETED_INTRO_REGISTRATION_IDS_KEY, JSON.stringify(ids));
};

export const getAllIntroRegistrations = (): IntroRegistration[] => {
  const storedIntroRegistrations = getStoredIntroRegistrations();
  const deletedIds = getDeletedIntroRegistrationIds();

  const registrationMap = new Map<number, IntroRegistration>();

  mockIntroRegistrations.forEach((registration) => {
    registrationMap.set(registration.id, registration);
  });

  storedIntroRegistrations.forEach((registration) => {
    registrationMap.set(registration.id, registration);
  });

  return Array.from(registrationMap.values()).filter(
    (registration) => !deletedIds.includes(registration.id)
  );
};

export const saveIntroRegistrations = (
  registrations: IntroRegistration[]
): void => {
  localStorage.setItem(INTRO_REGISTRATIONS_KEY, JSON.stringify(registrations));
};

export const addIntroRegistration = (
  registration: Omit<IntroRegistration, "id">
): IntroRegistration => {
  const allRegistrations = getAllIntroRegistrations();

  const nextId =
    allRegistrations.length > 0
      ? Math.max(...allRegistrations.map((item) => item.id)) + 1
      : 1;

  const newRegistration: IntroRegistration = {
    id: nextId,
    ...registration,
  };

  const storedRegistrations = getStoredIntroRegistrations();

  saveIntroRegistrations([...storedRegistrations, newRegistration]);

  return newRegistration;
};

export const updateIntroRegistration = (
  updatedRegistration: IntroRegistration
): void => {
  const storedRegistrations = getStoredIntroRegistrations();

  const existingIndex = storedRegistrations.findIndex(
    (registration) => registration.id === updatedRegistration.id
  );

  if (existingIndex >= 0) {
    storedRegistrations[existingIndex] = updatedRegistration;
    saveIntroRegistrations(storedRegistrations);
    return;
  }

  saveIntroRegistrations([...storedRegistrations, updatedRegistration]);
};

export const deleteIntroRegistration = (id: number): void => {
  const storedRegistrations = getStoredIntroRegistrations();

  const updatedStoredRegistrations = storedRegistrations.filter(
    (registration) => registration.id !== id
  );

  saveIntroRegistrations(updatedStoredRegistrations);

  const deletedIds = getDeletedIntroRegistrationIds();

  if (!deletedIds.includes(id)) {
    saveDeletedIntroRegistrationIds([...deletedIds, id]);
  }
};