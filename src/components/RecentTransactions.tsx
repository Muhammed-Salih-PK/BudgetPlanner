"use client";
import { useTransactionStore } from "@/store/useTransactions";
import React from "react";

const RecentTransactions = () => {
  const { transactions } = useTransactionStore();
  return (
    <div className='bg-white dark:bg-gray-900 rounded-xl shadow overflow-hidden'>
      <div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-white font-figtree'>
          Recent Transactions
        </h3>
      </div>
      <div className='divide-y divide-gray-200 dark:divide-gray-700'>
        {transactions
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, 5)
          .map((t) => (
            <div
              key={t.id}
              className='px-6 py-4 flex items-center justify-between'
            >
              <div className='flex items-center'>
                <div
                  className={`p-2 rounded-lg mr-4 ${
                    t.type === "income"
                      ? "bg-green-100 dark:bg-green-900/30"
                      : "bg-red-100 dark:bg-red-900/30"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 ${
                      t.type === "income"
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
                      d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
                <div>
                  <h4 className='font-medium text-gray-900 dark:text-white'>
                    {t.name}
                  </h4>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    {new Date(t.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}{" "}
                    • {t.category || "Uncategorized"}
                  </p>
                </div>
              </div>
              <div
                className={`font-medium ${
                  t.type === "income"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {t.type === "income" ? "+" : "-"}${t.amount.toFixed(2)}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
