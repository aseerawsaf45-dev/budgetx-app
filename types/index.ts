export type Currency = 'BDT';

export interface Contributor {
  id: string;
  name: string;
  avatar?: string;
}

export interface Expense {
  id: string;
  tourId: string;
  title: string;
  details?: string;
  amount: number;
  date: string;
  day: number;
  category: 'Transport' | 'Hotel' | 'Food' | 'Snacks' | 'Tickets' | 'Guide' | 'Emergency' | 'Miscellaneous';
  paidBy: Record<string, number>; // Contributor ID -> Amount Paid
  splitAmong: string[]; // Contributor IDs
  splitType: 'EQUAL';
  paymentType?: 'EXACT' | 'PERCENTAGE' | 'SHARES';
  paymentValues?: Record<string, number>;
}

export interface Tour {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  days: number;
  estimatedParticipants: number;
  totalBudget: number;
  contributors: Contributor[];
  expenses: Expense[];
  createdAt: string;
}
