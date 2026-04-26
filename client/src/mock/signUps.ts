export type SignUpMop = "Cash" | "GCash" | "Bank Transfer" | "Credit Card";

export type PaymentOrDeposit = "Full Payment" | "Deposit";

export type ChildGender = "Male" | "Female";

export type CampDate = "May Camp" | "October Camp";

export type ShirtSize = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export interface SignUpChild {
  name: string;
  school: string;
  gender: ChildGender;
  campDate: CampDate;
  size: ShirtSize;
}

export interface SignUpRecord {
  id: number;
  guardianName: string;
  mop: SignUpMop;
  paymentOrDeposit: PaymentOrDeposit;
  childPayment: number;
  signUpPreviewDate: string;
  contactReminders: string;
  children: SignUpChild[];
}

export const mockSignUps: SignUpRecord[] = [
  {
    id: 1,
    guardianName: "Maria Santos",
    mop: "GCash",
    paymentOrDeposit: "Deposit",
    childPayment: 5000,
    signUpPreviewDate: "2026-04-05",
    contactReminders: "1W Reminder sent through Viber",
    children: [
      {
        name: "Juan Santos",
        school: "St. Mary Academy",
        gender: "Male",
        campDate: "May Camp",
        size: "M",
      },
      {
        name: "Ana Santos",
        school: "St. Mary Academy",
        gender: "Female",
        campDate: "May Camp",
        size: "S",
      },
    ],
  },
  {
    id: 2,
    guardianName: "Jose Reyes",
    mop: "Cash",
    paymentOrDeposit: "Full Payment",
    childPayment: 49000,
    signUpPreviewDate: "2026-04-08",
    contactReminders: "Confirmed after call",
    children: [
      {
        name: "Marco Reyes",
        school: "Cebu International School",
        gender: "Male",
        campDate: "October Camp",
        size: "L",
      },
    ],
  },
];