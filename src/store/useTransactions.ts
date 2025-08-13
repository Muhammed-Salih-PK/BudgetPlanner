import { ITransaction } from "@/types/transaction";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuid } from "uuid";

interface ITransactionState {
  transactions: ITransaction[];
  addTransaction: (t: Omit<ITransaction, "id">) => void;
  updateTransaction: (id: string, updated: Partial<ITransaction>) => void;
  deleteTransaction: (id: string) => void;
}

export const useTransactionStore = create<ITransactionState>()(
  persist(
    (set) => ({
      transactions: [],
      addTransaction: (t) =>
        set((state) => ({
          transactions: [...state.transactions, { ...t, id: uuid() }],
        })),
      updateTransaction: (id, updated) =>
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.id === id ? { ...tx, ...updated } : tx
          ),
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((tx) => tx.id !== id),
        })),
    }),
    { name: "budget-planner" }
  )
);
