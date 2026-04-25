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
  paymentStatus: 'Paid' | 'Partial' | 'Unpaid';
  balance: number;
  confirmationStatus: 'Confirmed' | 'Pending' | 'Not Responding' | 'Cancelled';
  callStatus: string;
  hasAllergyNotes: boolean;
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
  },
  {
    id: '3',
    receiptNo: 'REC-003',
    participantName: 'Robert Brown',
    nickname: 'Rob',
    participantNumber: '017-9988776',
    participantEmail: 'rob@example.com',
    program: 'Youth Leadership',
    cityOfCamp: 'Johor Bahru',
    intake: 'June 2024',
    paymentStatus: 'Unpaid',
    balance: 500,
    confirmationStatus: 'Not Responding',
    callStatus: 'No answer',
    hasAllergyNotes: false,
  },
  {
    id: '4',
    receiptNo: 'REC-004',
    participantName: 'Emily Davis',
    nickname: 'Em',
    participantNumber: '019-5544332',
    participantEmail: 'emily@example.com',
    program: 'Science Exploration',
    cityOfCamp: 'Kuala Lumpur',
    intake: 'August 2024',
    paymentStatus: 'Paid',
    balance: 0,
    confirmationStatus: 'Cancelled',
    callStatus: 'Parent cancelled',
    hasAllergyNotes: false,
  },
  {
    id: '5',
    receiptNo: 'REC-005',
    participantName: 'Michael Wilson',
    nickname: 'Mike',
    participantNumber: '013-1122334',
    participantEmail: 'mike@example.com',
    program: 'Creative Writing',
    cityOfCamp: 'Melaka',
    intake: 'July 2024',
    paymentStatus: 'Paid',
    balance: 0,
    confirmationStatus: 'Confirmed',
    callStatus: 'Called - Confirmed',
    hasAllergyNotes: true,
  },
];
