export type ContactChannel = 'Call' | 'SMS' | 'Viber' | 'Email' | 'Other';

export interface ContactLog {
  id: string;
  participantId: string;
  receiptNo: string;
  participantName: string;
  messageType: string;
  channel: ContactChannel;
  dateSent: string;
  response: string;
  callStatus: string;
  notes: string;
}

export const mockContactLogs: ContactLog[] = [
  {
    id: 'L-001',
    participantId: '1',
    receiptNo: 'REC-001',
    participantName: 'John Doe',
    messageType: 'Event Reminder',
    channel: 'Email',
    dateSent: '2024-04-20',
    response: 'Opened',
    callStatus: 'N/A',
    notes: 'Sent via Mailchimp'
  },
  {
    id: 'L-002',
    participantId: '2',
    receiptNo: 'REC-002',
    participantName: 'Jane Smith',
    messageType: 'Payment Follow-up',
    channel: 'Call',
    dateSent: '2024-04-22',
    response: 'Busy',
    callStatus: 'Try again later',
    notes: 'Customer was driving'
  }
];
