import type { Payment } from "../mock/payments";
import { mockPayments } from "../mock/payments";
import type { Participant, PaymentStatus } from "../mock/participants";

/**
 * Combine mockPayments and localStorage payments, filtering out deleted ones.
 */
export const getAllPayments = (): Payment[] => {
  let merged: Payment[] = [...mockPayments];

  // 1. Apply localStorage additions/overrides
  const savedPayments = localStorage.getItem("livesmart_payments");
  if (savedPayments) {
    try {
      const localPayments: Payment[] = JSON.parse(savedPayments);
      localPayments.forEach((lp) => {
        const index = merged.findIndex((mp) => mp.id === lp.id);
        if (index !== -1) {
          merged[index] = lp;
        } else {
          merged.push(lp);
        }
      });
    } catch (e) {
      console.error("Failed to parse local payments", e);
    }
  }

  // 2. Remove deleted payments
  const deletedIdsRaw = localStorage.getItem("livesmart_deleted_payment_ids");
  if (deletedIdsRaw) {
    try {
      const deletedIds: string[] = JSON.parse(deletedIdsRaw);
      merged = merged.filter((p) => !deletedIds.includes(p.id));
    } catch (e) {
      console.error("Failed to parse deleted payment IDs", e);
    }
  }

  return merged;
};

/**
 * Return all payments for one participant.
 */
export const getParticipantPayments = (participantId: string): Payment[] => {
  const allPayments = getAllPayments();
  return allPayments.filter((p) => p.participantId === participantId);
};

/**
 * Return sum of all payment amounts for that participant.
 */
export const getParticipantTotalPaid = (participantId: string): number => {
  const payments = getParticipantPayments(participantId);
  return payments.reduce((acc, curr) => acc + curr.amount, 0);
};

/**
 * Subtract total paid from participant.balance (original balance).
 * Minimum should be 0.
 */
export const getParticipantComputedBalance = (participant: Participant): number => {
  const totalPaid = getParticipantTotalPaid(participant.id);
  const balance = participant.balance - totalPaid;
  return Math.max(0, balance);
};

/**
 * Compute payment status based on computed balance and total paid.
 */
export const getParticipantComputedPaymentStatus = (
  participant: Participant
): PaymentStatus => {
  const totalPaid = getParticipantTotalPaid(participant.id);
  const computedBalance = getParticipantComputedBalance(participant);

  if (computedBalance === 0) {
    return "Paid";
  }
  
  if (totalPaid > 0 && computedBalance > 0) {
    return "Partial";
  }
  
  return "Unpaid";
};
