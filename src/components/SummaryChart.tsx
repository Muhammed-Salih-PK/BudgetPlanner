"use client";
import { useTransactionStore } from "@/store/useTransactions";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

import React, { useState } from "react";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";

export const ApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className='h-[350px] flex items-center justify-center'>
      <div className='flex flex-col items-center gap-3'>
        <div className='relative h-12 w-12'>
          {/* Animated spinner */}
          <div className='absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin'></div>
          {/* Optional logo or icon in center */}
          <div className='absolute inset-1 flex items-center justify-center'>
            <svg
              className='h-6 w-6 text-blue-500'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path d='M12 2L4 7v10l8 5 8-5V7l-8-5z' />
            </svg>
          </div>
        </div>
        <p className='text-gray-600 dark:text-gray-400 text-sm font-medium'>
          Loading chart data...
        </p>
        {/* Optional progress bar */}
        <div className='w-32 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
          <div
            className='h-full bg-blue-500 animate-pulse'
            style={{ width: "80%" }}
          ></div>
        </div>
      </div>
    </div>
  ),
});

const SummaryChart = () => {
  const { transactions } = useTransactionStore();
  const [highlightSeries, setHighlightSeries] = useState<
    "income" | "expense" | null
  >(null);

  // Calculate financial metrics
  const expenseTotal = transactions
    .filter((val) => val.type === "expense")
    .reduce((sum, i) => sum + i.amount, 0);

  const incomeTotal = transactions
    .filter((val) => val.type === "income")
    .reduce((sum, i) => sum + i.amount, 0);

  const balance = incomeTotal - expenseTotal;
  const savingsRate =
    incomeTotal > 0 ? Number(((balance / incomeTotal) * 100).toFixed(1)) : 0;

  // Prepare chart data
  const chartOptions: ApexOptions = {
    chart: {
      type: "area",
      height: 100,
      toolbar: { show: false },
      zoom: { enabled: false },
      foreColor: "#6B7280",
      sparkline: {
        enabled: true,
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
      },
    },
    xaxis: {
      type: "datetime",
      labels: { show: false },
    },
    yaxis: {
      show: false,
    },
    tooltip: { enabled: false },
    legend: { show: false },
    grid: { show: false },
  };

  // Prepare series data
  const incomeSeries = {
    name: "Income",
    data: transactions
      .filter((t) => t.type === "income")
      .map((t) => ({
        x: new Date(t.date).getTime(),
        y: t.amount,
      }))
      .sort((a, b) => a.x - b.x),
  };

  const expenseSeries = {
    name: "Expense",
    data: transactions
      .filter((t) => t.type === "expense")
      .map((t) => ({
        x: new Date(t.date).getTime(),
        y: t.amount,
      }))
      .sort((a, b) => a.x - b.x),
  };

  // Calculate net balance over time
  const balanceSeries = {
    name: "Balance",
    data: [...transactions]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .reduce((acc, t) => {
        const lastBalance = acc.length > 0 ? acc[acc.length - 1].y : 0;
        const newBalance =
          t.type === "income" ? lastBalance + t.amount : lastBalance - t.amount;
        acc.push({
          x: new Date(t.date).getTime(),
          y: newBalance,
        });
        return acc;
      }, [] as { x: number; y: number }[]),
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 '>
      {/* Income Card */}
      <div
        className='bg-blue-50 dark:bg-blue-900/20 rounded-xl shadow overflow-hidden'
        onMouseEnter={() => setHighlightSeries("income")}
        onMouseLeave={() => setHighlightSeries(null)}
      >
        <div className='p-4'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-500 dark:text-gray-400 text-sm font-medium'>
                Total Income
              </p>
              <h3 className='text-2xl font-bold text-gray-900 dark:text-white mt-1'>
                ${incomeTotal.toFixed(2)}
              </h3>
            </div>
            <div className='p-2 rounded-lg bg-green-100 dark:bg-green-900/30'>
              <FiArrowUp className='w-5 h-5 text-green-600 dark:text-green-400' />
            </div>
          </div>
        </div>
        <div className='h-20 w-full -mb-1'>
          <ApexChart
            options={{
              ...chartOptions,
              colors:
                highlightSeries === "income" ? ["#10B981"] : ["#10B98150"],
              fill: {
                ...chartOptions.fill,
                opacity: highlightSeries === "income" ? 1 : 0.3,
              },
            }}
            series={[incomeSeries]}
            type='area'
            height='100%'
            width='100%'
          />
        </div>
      </div>

      {/* Expense Card */}
      <div
        className='bg-red-50 dark:bg-red-900/20 rounded-xl shadow overflow-hidden'
        onMouseEnter={() => setHighlightSeries("expense")}
        onMouseLeave={() => setHighlightSeries(null)}
      >
        <div className='p-4'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-500 dark:text-gray-400 text-sm font-medium'>
                Total Expenses
              </p>
              <h3 className='text-2xl font-bold text-gray-900 dark:text-white mt-1'>
                ${expenseTotal.toFixed(2)}
              </h3>
            </div>
            <div className='p-2 rounded-lg bg-red-100 dark:bg-red-900/30'>
              <FiArrowDown className='w-5 h-5 text-red-600 dark:text-red-400' />
            </div>
          </div>
        </div>
        <div className='h-20 w-full -mb-1'>
          <ApexChart
            options={{
              ...chartOptions,
              colors:
                highlightSeries === "expense" ? ["#EF4444"] : ["#EF444450"],
              fill: {
                ...chartOptions.fill,
                opacity: highlightSeries === "expense" ? 1 : 0.3,
              },
            }}
            series={[expenseSeries]}
            type='area'
            height='100%'
            width='100%'
          />
        </div>
      </div>

      {/* Balance Card */}
      <div
        className={`rounded-xl shadow overflow-hidden ${
          balance >= 0
            ? "bg-green-50 dark:bg-green-900/20"
            : "bg-red-50 dark:bg-red-900/20"
        }`}
      >
        <div className='p-4'>
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
        <div className='h-20 w-full -mb-1 mt-4'>
          <ApexChart
            options={{
              ...chartOptions,
              colors: [balance >= 0 ? "#10B981" : "#EF4444"],
              fill: {
                ...chartOptions.fill,
                opacity: 1,
              },
            }}
            series={[balanceSeries]}
            type='area'
            height='100%'
            width='100%'
          />
        </div>
      </div>
    </div>
  );
};

export default SummaryChart;
