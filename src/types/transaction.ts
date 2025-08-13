export type TransactionTypes = "income" | "expense";
export type TransactionFilterType = TransactionTypes | "both";
export type ChartDatesType = "week" | "month" | "year";
export type TabsType = "overview" | "categories";
export type CategoryType = '' | 'Food' | 'Transport' | 'Salary' | 'Shopping' | 'Bills' | 'Other'
export type FormState = {
  date: string;
  name: string;
  amount: string;
  type: TransactionTypes;
  category: string;
};

// Type definitions for better type safety
export type GroupedTransactionData = Record<
  number,
  { income: number; expense: number }
>;

export type CategoryData = {
  name: string;
  income: number;
  expense: number;
}[];

export interface ITransaction {
  id: string;
  date: string;
  name: string;
  amount: number;
  type: TransactionTypes;
  category: string;
  note?: string;
}

