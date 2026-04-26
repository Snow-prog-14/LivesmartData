export type LeadStatus =
  | "Interested"
  | "For Follow-up"
  | "No Response"
  | "Responded"
  | "Not Interested"
  | "Converted to Preview";

export interface Lead {
  id: number;
  name: string;
  contactNo: string;
  email: string;
  source: string;
  status: LeadStatus;
  remarks: string;
}

export const mockLeads: Lead[] = [
  {
    id: 1,
    name: "Maria Santos",
    contactNo: "09171234567",
    email: "maria.santos@example.com",
    source: "Facebook Ads",
    status: "Interested",
    remarks: "Asked about camp schedule and fees.",
  },
  {
    id: 2,
    name: "Jose Reyes",
    contactNo: "09281234567",
    email: "jose.reyes@example.com",
    source: "Referral",
    status: "For Follow-up",
    remarks: "Requested a callback tomorrow.",
  },
  {
    id: 3,
    name: "Ana Cruz",
    contactNo: "09391234567",
    email: "ana.cruz@example.com",
    source: "Instagram Ads",
    status: "No Response",
    remarks: "No response after first message.",
  },
];