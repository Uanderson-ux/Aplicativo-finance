
export type Category = 'Geral' | 'Alimentação' | 'Moradia' | 'Transporte' | 'Lazer' | 'Saúde';

export interface Expense {
  id: string;
  name: string;
  value: number;
  category: Category;
  isPaid: boolean;
  isRecurrent: boolean;
  dueDay?: number;
}

export interface MonthData {
  salary: number;
  expenses: Expense[];
}

export interface AppState {
  [monthKey: string]: MonthData; // key format: YYYY-MM
}
