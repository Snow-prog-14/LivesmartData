export type PaymentStatus = 'Paid' | 'Partial' | 'Unpaid';
export type ConfirmationStatus = 'Confirmed' | 'Pending' | 'Not Responding' | 'Cancelled';

export interface PaymentHistory {
  paymentNo: string;
  amount: number;
  mode: string;
  date: string;
  trackingNo: string;
}

export interface ContactLog {
  messageType: string;
  channel: string;
  dateSent: string;
  response: string;
  notes: string;
}

export interface Participant {
  id: string;
  receiptNo: string;
  participantName: string;
  nickname: string;
  participantNumber: string;
  participantEmail: string;
  program: string;
  cityOfCamp: string;
  intake: string;
  paymentStatus: PaymentStatus;
  balance: number;
  confirmationStatus: ConfirmationStatus;
  callStatus: string;
  hasAllergyNotes: boolean;
  
  // New Participant fields
  tShirtSize: string;
  gender: string;
  dateOfBirth: string;
  age: number;
  school: string;

  // Parents Info
  fatherFirstName: string;
  fatherLastName: string;
  fatherEmail: string;
  fatherMobile: string;
  motherFirstName: string;
  motherLastName: string;
  motherEmail: string;
  motherMobile: string;

  // Address fields
  mailingAddress: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;

  // Registration Info
  signUpYear: string;
  signedUpYear: string; // duplicate/alternate from requirements
  cityOfPreview: string;
  introductoryVenue: string;
  introVenue: string; // mapping for backwards compatibility if needed
  signUpDate: string;
  keyInDate: string;
  previewTrainer: string;
  seminarPackage: string;
  discounts: string;
  finalPackage: string;
  
  // New Registration fields
  intakeBasedOnRegistration: string;
  intakeConfirmation: string;
  previewIC: string;
  keyInTime: string;
  status2: string;

  // Package / Pricing fields
  previewPayment: number;
  previewPaymentType: string;
  previewPaymentTracking: string;
  whenToPay: string;
  datesToSendReminders: string;

  // Lists (Managed by other modules)
  paymentHistory: PaymentHistory[];
  contactLogs: ContactLog[];

  // Allergies & Remarks
  allergyNotes: string;
  remarks: string;
  statusNotes: string;
}

export const mockParticipants: Participant[] = [
  {
    id: '1',
    receiptNo: 'REC-001',
    participantName: 'John Doe',
    nickname: 'Johnny',
    participantNumber: '012-3456789',
    participantEmail: 'john@example.com',
    program: 'Youth Leadership',
    cityOfCamp: 'Kuala Lumpur',
    intake: 'June 2024',
    paymentStatus: 'Paid',
    balance: 0,
    confirmationStatus: 'Confirmed',
    callStatus: 'Called - Confirmed',
    hasAllergyNotes: false,
    tShirtSize: 'M',
    gender: 'Male',
    dateOfBirth: '2010-05-15',
    age: 14,
    school: 'SK Taman Tun',
    fatherFirstName: 'Robert',
    fatherLastName: 'Doe',
    fatherEmail: 'robert.doe@example.com',
    fatherMobile: '012-1112223',
    motherFirstName: 'Mary',
    motherLastName: 'Doe',
    motherEmail: 'mary.doe@example.com',
    motherMobile: '012-3334445',
    mailingAddress: '123, Jalan Bukit',
    city: 'Kuala Lumpur',
    state: 'WPKL',
    country: 'Malaysia',
    postalCode: '50000',
    signUpYear: '2024',
    signedUpYear: '2024',
    cityOfPreview: 'Petaling Jaya',
    introductoryVenue: 'Hotel Armada',
    introVenue: 'Hotel Armada',
    signUpDate: '2024-01-10',
    keyInDate: '2024-01-11',
    previewTrainer: 'Coach Michael',
    seminarPackage: 'Elite Package',
    discounts: 'Early Bird 10%',
    finalPackage: 'Elite (Discounted)',
    intakeBasedOnRegistration: 'June 2024',
    intakeConfirmation: 'June 2024',
    previewIC: 'Ms. Lim',
    keyInTime: '10:00 AM',
    status2: 'Registered',
    previewPayment: 500,
    previewPaymentType: 'Bank Transfer',
    previewPaymentTracking: 'TRK-9988',
    whenToPay: 'On Arrival',
    datesToSendReminders: '2024-05-01, 2024-05-15',
    paymentHistory: [
      { paymentNo: 'P-001', amount: 1500, mode: 'Online Transfer', date: '2024-01-15', trackingNo: 'TXN-9988' }
    ],
    contactLogs: [
      { messageType: 'Welcome', channel: 'Email', dateSent: '2024-01-12', response: 'Received', notes: 'Sent onboarding docs' }
    ],
    allergyNotes: 'None',
    remarks: 'Very active in preview seminar',
    statusNotes: 'Ready for camp'
  },
  {
    id: '2',
    receiptNo: 'REC-002',
    participantName: 'Jane Smith',
    nickname: 'Jane',
    participantNumber: '011-2233445',
    participantEmail: 'jane@example.com',
    program: 'Creative Writing',
    cityOfCamp: 'Penang',
    intake: 'July 2024',
    paymentStatus: 'Partial',
    balance: 200,
    confirmationStatus: 'Pending',
    callStatus: 'Follow-up needed',
    hasAllergyNotes: true,
    tShirtSize: 'S',
    gender: 'Female',
    dateOfBirth: '2011-08-20',
    age: 13,
    school: 'SMK Penang Jaya',
    fatherFirstName: 'William',
    fatherLastName: 'Smith',
    fatherEmail: 'william@example.com',
    fatherMobile: '011-9988776',
    motherFirstName: 'Sarah',
    motherLastName: 'Smith',
    motherEmail: 'sarah@example.com',
    motherMobile: '011-5544332',
    mailingAddress: '45, Gurney Drive',
    city: 'Penang',
    state: 'Penang',
    country: 'Malaysia',
    postalCode: '10000',
    signUpYear: '2024',
    signedUpYear: '2024',
    cityOfPreview: 'Penang',
    introductoryVenue: 'Cititel Hotel',
    introVenue: 'Cititel Hotel',
    signUpDate: '2024-02-05',
    keyInDate: '2024-02-06',
    previewTrainer: 'Ms. Alice',
    seminarPackage: 'Standard Package',
    discounts: 'None',
    finalPackage: 'Standard',
    intakeBasedOnRegistration: 'July 2024',
    intakeConfirmation: 'July 2024',
    previewIC: 'Mr. Tan',
    keyInTime: '02:00 PM',
    status2: 'Partial Payment',
    previewPayment: 300,
    previewPaymentType: 'Cash',
    previewPaymentTracking: 'C-001',
    whenToPay: 'Installments',
    datesToSendReminders: '2024-06-01',
    paymentHistory: [
      { paymentNo: 'P-002', amount: 800, mode: 'Credit Card', date: '2024-02-10', trackingNo: 'TXN-1122' }
    ],
    contactLogs: [
      { messageType: 'Follow up', channel: 'WhatsApp', dateSent: '2024-03-01', response: 'Interested', notes: 'Asked about balance' }
    ],
    allergyNotes: 'Peanut allergy',
    remarks: 'Needs quiet environment for writing',
    statusNotes: 'Awaiting balance payment'
  }
];
