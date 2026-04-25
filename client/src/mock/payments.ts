export type PaymentMode = 'Cash' | 'GCash' | 'Bank Transfer' | 'Credit Card' | 'Other';

export interface Payment {
  id: string;
  participantId: string;
  receiptNo: string;
  participantName: string;
  paymentNumber: string;
  amount: number;
  modeOfPayment: PaymentMode;
  paymentDate: string;
  trackingNumber: string;
  remarks: string;
}

export const mockPayments: Payment[] = [
  {
    id: 'pay-1',
    participantId: '1',
    receiptNo: 'REC-001',
    participantName: 'John Doe',
    paymentNumber: 'PMT-1001',
    amount: 5000,
    modeOfPayment: 'Cash',
    paymentDate: '2023-05-15',
    trackingNumber: 'N/A',
    remarks: 'Initial deposit'
  },
  {
    id: 'pay-2',
    participantId: '2',
    receiptNo: 'REC-002',
    participantName: 'Jane Smith',
    paymentNumber: 'PMT-1002',
    amount: 7500,
    modeOfPayment: 'GCash',
    paymentDate: '2023-05-16',
    trackingNumber: 'GC-992182',
    remarks: 'Full payment'
  }
];
