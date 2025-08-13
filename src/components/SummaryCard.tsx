
import { useTransactionStore } from "@/store/useTransactions";
import React from "react";

const SummaryCard = () => {
  const { transactions } = useTransactionStore();

  // Calculate financial metrics
  const expenseTotal = transactions
    .filter((val) => val.type === "expense")
    .reduce((sum, i) => sum + i.amount, 0);

  const incomeTotal = transactions
    .filter((val) => val.type === "income")
    .reduce((sum, i) => sum + i.amount, 0);

  const balance = incomeTotal - expenseTotal;
  const savingsRate =
    incomeTotal > 0 ? ((balance / incomeTotal) * 100).toFixed(1) : 0;
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
      <div className='bg-blue-50 dark:bg-green-900/20 rounded-xl shadow p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-gray-500 dark:text-gray-400 text-sm font-medium'>
              Total Income
            </p>
            <h3 className='text-2xl font-bold text-gray-900 dark:text-white mt-1'>
              ${incomeTotal.toFixed(2)}
            </h3>
          </div>
          <div className='p-3 rounded-lg bg-green-100 dark:bg-green-900/30'>
            <svg
              className='w-6 h-6 text-green-600 dark:text-green-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
        </div>
      </div>

      <div className='bg-red-50 dark:bg-red-900/20 rounded-xl shadow p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-gray-500 dark:text-gray-400 text-sm font-medium'>
              Total Expenses
            </p>
            <h3 className='text-2xl font-bold text-gray-900 dark:text-white mt-1'>
              ${expenseTotal.toFixed(2)}
            </h3>
          </div>
          <div className='p-3 rounded-lg bg-red-100 dark:bg-red-900/30'>
            <svg
              className='w-6 h-6 text-red-600 dark:text-red-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
        </div>
      </div>

      <div
        className={`rounded-xl shadow p-6 ${
          balance >= 0
            ? "bg-green-50 dark:bg-green-900/20"
            : "bg-red-50 dark:bg-red-900/20"
        }`}
      >
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-gray-500 dark:text-gray-400 text-sm font-medium'>
              Current Balance
            </p>
            <h3
              className={`text-2xl font-bold mt-1 ${
                balance >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              ${balance.toFixed(2)}
            </h3>
            {incomeTotal > 0 && (
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                {savingsRate}% savings rate
              </p>
            )}
          </div>
          <div
            className={`p-3 rounded-lg ${
              balance >= 0
                ? "bg-green-100 dark:bg-green-800/30"
                : "bg-red-100 dark:bg-red-800/30"
            }`}
          >
            <svg
              className={`w-6 h-6 ${
                balance >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
