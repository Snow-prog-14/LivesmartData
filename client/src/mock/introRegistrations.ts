export type IntroAttendance = "Yes" | "No";

export type IntroReminder =
  | "Confirmed"
  | "1W Reminder"
  | "3D Reminder"
  | "1D Reminder"
  | "D Reminder"
  | "Cancelled";

export type IntroSignUp = "Yes" | "No";

export type PaymentMethod =
  | "Cash"
  | "GCash"
  | "Bank Transfer"
  | "Credit Card";

export interface PreviewChild {
  name: string;
  school: string;
}

export interface IntroRegistration {
  id: number;
  email: string;
  name: string;
  relationshipWithChildren: string;
numberOfChildren: number;
children: PreviewChild[];
  totalPax: number;
  contactNo: string;
  cityOfPreview: string;
  signUpDate: string;
  introSessionDate: string;
  registration: string;
  reminder: IntroReminder;
  attendance: IntroAttendance;
  ads: string;
  noResponses: boolean;
  responded: boolean;
  confirmed: boolean;
  totalLeads: number;
  remarks: string;
  signUp: IntroSignUp;
  signUpPax: number;
  paymentMethod: PaymentMethod;
  
}

export const mockIntroRegistrations: IntroRegistration[] = [
  {
    id: 1,
    email: "maria.santos@example.com",
name: "Maria Santos",
relationshipWithChildren: "Mother",
numberOfChildren: 2,
children: [
  {
    name: "Juan Santos",
    school: "St. Mary Academy",
  },
  {
    name: "Ana Santos",
    school: "St. Mary Academy",
  },
],    totalPax: 3,
    contactNo: "09171234567",
cityOfPreview: "Manila",    signUpDate: "2026-04-01",
    introSessionDate: "2026-04-05",
    registration: "Registered for introductory session",
    reminder: "Confirmed",
    attendance: "Yes",
    ads: "Facebook Ads",
    noResponses: false,
    responded: true,
    confirmed: true,
    totalLeads: 3,
    remarks: "Interested in registering 2 kids for camp.",
    signUp: "Yes",
    signUpPax: 2,
    paymentMethod: "GCash",
  },
  {
    id: 2,
    email: "jose.reyes@example.com",
name: "Jose Reyes",
relationshipWithChildren: "Father",
numberOfChildren: 1,
children: [
  {
    name: "Marco Reyes",
    school: "Cebu International School",
  },
],    totalPax: 2,
    contactNo: "09281234567",
cityOfPreview: "Cebu",    signUpDate: "2026-04-03",
    introSessionDate: "2026-04-08",
    registration: "For attendance confirmation",
    reminder: "1D Reminder",
    attendance: "No",
    ads: "Referral",
    noResponses: false,
    responded: true,
    confirmed: false,
    totalLeads: 2,
    remarks: "Asked to be reminded before the session.",
    signUp: "No",
    signUpPax: 0,
    paymentMethod: "Cash",
  },
  {
    id: 3,
    email: "ana.cruz@example.com",
name: "Ana Cruz",
relationshipWithChildren: "Guardian",
numberOfChildren: 1,
children: [
  {
    name: "Lia Cruz",
    school: "Davao Christian High School",
  },
],    totalPax: 4,
    contactNo: "09391234567",
cityOfPreview: "Davao",    signUpDate: "2026-04-04",
    introSessionDate: "2026-04-10",
    registration: "Registered but not yet confirmed",
    reminder: "3D Reminder",
    attendance: "No",
    ads: "Instagram Ads",
    noResponses: true,
    responded: false,
    confirmed: false,
    totalLeads: 4,
    remarks: "No response after first message.",
    signUp: "No",
    signUpPax: 0,
    paymentMethod: "Bank Transfer",
  },
];