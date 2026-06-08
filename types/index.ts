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
  amount: number;
  date: string;
  day: number;
  category: 'Transport' | 'Hotel' | 'Food' | 'Snacks' | 'Tickets' | 'Guide' | 'Emergency' | 'Miscellaneous';
  paidBy: string; // Contributor ID
  splitAmong: string[]; // Contributor IDs
  splitType: 'EQUAL' | 'CUSTOM';
  customSplit?: Record<string, number>; // Contributor ID -> Amount
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
