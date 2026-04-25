export type ConfirmationStatus = 'Confirmed' | 'Pending' | 'Not Responding' | 'Cancelled';

export type ConfirmVia = 'Call' | 'SMS' | 'Viber' | 'Email' | 'In Person';

export interface ConfirmationRecord {
  id: string;
  participantId: string;
  receiptNo: string;
  participantName: string;
  confirmationPeriod: string;
  confirmationStatus: ConfirmationStatus;
  finalConfirmation: string;
  dateConfirmation: string;
  confirmVia: ConfirmVia;
  callStatus: string;
  response: string;
  remarks: string;
}

export const mockConfirmations: ConfirmationRecord[] = [
  {
    id: 'C-001',
    participantId: '1',
    receiptNo: 'REC-001',
    participantName: 'John Doe',
    confirmationPeriod: 'Pre-Camp',
    confirmationStatus: 'Confirmed',
    finalConfirmation: 'Yes',
    dateConfirmation: '2024-05-01',
    confirmVia: 'Call',
    callStatus: 'Completed',
    response: 'Attending',
    remarks: 'Coming with family'
  },
  {
    id: 'C-002',
    participantId: '2',
    receiptNo: 'REC-002',
    participantName: 'Jane Smith',
    confirmationPeriod: 'Pre-Camp',
    confirmationStatus: 'Pending',
    finalConfirmation: 'No',
    dateConfirmation: '2024-05-02',
    confirmVia: 'SMS',
    callStatus: 'No Answer',
    response: 'Awaiting reply',
    remarks: 'Sent 1st SMS'
  }
];
