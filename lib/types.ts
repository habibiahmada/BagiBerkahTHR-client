/**
 * Type definitions untuk BagiBerkah
 */

export type AgeLevel = 'child' | 'teen' | 'adult';
export type Status = 'school' | 'college' | 'working' | 'not_working';
export type Closeness = 'very_close' | 'close' | 'distant';
export type DistributionMode = 'digital' | 'cash';
export type ClaimStatus = 'pending' | 'opened' | 'claimed' | 'validated' | 'expired';

export interface Recipient {
  id: string;
  name: string;
  ageLevel: AgeLevel;
  status: Status;
  closeness: Closeness;
  contact?: string;
  greetingContext?: string;
  allocatedAmount?: number;
  aiReasoning?: string;
}

export interface Envelope {
  id: string;
  totalBudget: number;
  distributionMode: DistributionMode;
  recipients: Recipient[];
  createdAt: string;
  status: 'draft' | 'pending_payment' | 'active' | 'completed';
  paymentUrl?: string;
}

export interface AIAllocationRequest {
  totalBudget: number;
  recipients: Omit<Recipient, 'id' | 'allocatedAmount' | 'aiReasoning'>[];
}

export interface AIAllocationResponse {
  allocations: {
    recipientIndex: number;
    amount: number;
    reasoning: string;
  }[];
  totalAllocated: number;
}

export interface ClaimData {
  token: string;
  recipientName: string;
  amount: number;
  greeting: string;
  status: ClaimStatus;
  qrToken?: string;
  expiresAt: string;
}

export interface PaymentData {
  paymentId: string;
  paymentUrl: string;
  amount: number;
  status: 'pending' | 'success' | 'failed';
}
