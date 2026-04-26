import { mockLeads } from "../mock/leads";
import type { Lead } from "../mock/leads";

const LEADS_KEY = "livesmart_leads";
const DELETED_LEAD_IDS_KEY = "livesmart_deleted_lead_ids";

const getStoredLeads = (): Lead[] => {
  const storedData = localStorage.getItem(LEADS_KEY);

  if (!storedData) {
    return [];
  }

  try {
    return JSON.parse(storedData) as Lead[];
  } catch {
    return [];
  }
};

const getDeletedLeadIds = (): number[] => {
  const storedData = localStorage.getItem(DELETED_LEAD_IDS_KEY);

  if (!storedData) {
    return [];
  }

  try {
    return JSON.parse(storedData) as number[];
  } catch {
    return [];
  }
};

const saveDeletedLeadIds = (ids: number[]) => {
  localStorage.setItem(DELETED_LEAD_IDS_KEY, JSON.stringify(ids));
};

export const getAllLeads = (): Lead[] => {
  const storedLeads = getStoredLeads();
  const deletedIds = getDeletedLeadIds();

  const leadMap = new Map<number, Lead>();

  mockLeads.forEach((lead) => {
    leadMap.set(lead.id, lead);
  });

  storedLeads.forEach((lead) => {
    leadMap.set(lead.id, lead);
  });

  return Array.from(leadMap.values()).filter(
    (lead) => !deletedIds.includes(lead.id)
  );
};

export const saveLeads = (leads: Lead[]): void => {
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
};

export const addLead = (lead: Omit<Lead, "id">): Lead => {
  const allLeads = getAllLeads();

  const nextId =
    allLeads.length > 0
      ? Math.max(...allLeads.map((item) => item.id)) + 1
      : 1;

  const newLead: Lead = {
    id: nextId,
    ...lead,
  };

  const storedLeads = getStoredLeads();

  saveLeads([...storedLeads, newLead]);

  return newLead;
};

export const updateLead = (updatedLead: Lead): void => {
  const storedLeads = getStoredLeads();

  const existingIndex = storedLeads.findIndex(
    (lead) => lead.id === updatedLead.id
  );

  if (existingIndex >= 0) {
    storedLeads[existingIndex] = updatedLead;
    saveLeads(storedLeads);
    return;
  }

  saveLeads([...storedLeads, updatedLead]);
};

export const deleteLead = (id: number): void => {
  const storedLeads = getStoredLeads();

  const updatedStoredLeads = storedLeads.filter((lead) => lead.id !== id);

  saveLeads(updatedStoredLeads);

  const deletedIds = getDeletedLeadIds();

  if (!deletedIds.includes(id)) {
    saveDeletedLeadIds([...deletedIds, id]);
  }
};