"use client";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import {
  CategoryData,
  ChartDatesType,
  GroupedTransactionData,
  TabsType,
  TransactionFilterType,
} from "@/types/transaction";
import { useTransactionStore } from "@/store/useTransactions";
import { useTheme } from "next-themes";
import { FiCreditCard, FiDollarSign, FiPieChart } from "react-icons/fi";
import { Select } from "./ui/Select";
import { getCutoffDate } from "@/utils/chartUtils";

// Constants for better maintainability
const CHART_HEIGHT = 350;
const CHART_COLORS = {
  income: "#10B981",
  expense: "#EF4444",
  others: ["#3B82F6", "#F59E0B", "#8B5CF6"],
};
const CATEGORY_COLORS = [
  CHART_COLORS.income,
  CHART_COLORS.expense,
  ...CHART_COLORS.others,
];

// Dynamic import of ApexCharts with SSR disabled
export const ApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className='h-[350px] flex items-center justify-center'>
      <div className='flex flex-col items-center gap-3'>
        <div className='relative h-12 w-12'>
          <div className='absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin' />
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
        <div className='w-32 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
          <div
            className='h-full bg-blue-500 animate-pulse'
            style={{ width: "80%" }}
          />
        </div>
      </div>
    </div>
  ),
});

/**
 * Gets data for the selected category type
 */
const getCategoryTypeData = (
  type: TransactionFilterType,
  data: CategoryData
): number[] => {
  switch (type) {
    case "both":
      return data.map((d) => d.income + d.expense);
    case "expense":
      return data.filter((t) => t.expense > 0).map((d) => d.expense);
    case "income":
      return data.filter((t) => t.income > 0).map((d) => d.income);
    default:
      return [];
  }
};

/**
 * Gets labels for the selected category type
 */
const getCategoryTypeLabels = (
  type: TransactionFilterType,
  data: CategoryData
): string[] => {
  switch (type) {
    case "both":
      return data.map((d) => d.name);
    case "expense":
      return data.filter((t) => t.expense > 0).map((d) => d.name);
    case "income":
      return data.filter((t) => t.income > 0).map((d) => d.name);
    default:
      return [];
  }
};

export default function ChartView({
  timeRange,
}: {
  timeRange: ChartDatesType;
}) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabsType>("overview");
  const [categoryType, setCategoryType] =
    useState<TransactionFilterType>("both");
  const { transactions } = useTransactionStore();

  /**
   * Filters transactions by the selected time range
   */
  const filteredTransactions = useMemo(() => {
    const cutoffDate = getCutoffDate(timeRange);
    return transactions.filter((t) => {
      const date = new Date(t.date);
      return !isNaN(date.getTime()) && date >= cutoffDate;
    });
  }, [transactions, timeRange]);

  /**
   * Groups transactions by date and calculates income/expense totals
   */
  const chartData = useMemo(() => {
    const grouped = filteredTransactions.reduce<GroupedTransactionData>(
      (acc, t) => {
        // Normalize to start of day to group by day (avoids timezone edge cases)
        const d = new Date(t.date);
        const ms = new Date(
          d.getFullYear(),
          d.getMonth(),
          d.getDate()
        ).getTime();

        if (!acc[ms]) acc[ms] = { income: 0, expense: 0 };
        if (t.type === "income") {
          acc[ms].income += t.amount;
        } else {
          acc[ms].expense += t.amount;
        }
        return acc;
      },
      {}
    );

    return Object.entries(grouped)
      .map(([ms, values]) => ({
        date: Number(ms),
        income: values.income,
        expense: values.expense,
      }))
      .sort((a, b) => a.date - b.date);
  }, [filteredTransactions]);

  /**
   * Groups transactions by category and calculates income/expense totals
   */
  const categoryData = useMemo<CategoryData>(() => {
    const categories = filteredTransactions.reduce<
      Record<string, { income: number; expense: number }>
    >((acc, t) => {
      const category = t.category || "Uncategorized";
      if (!acc[category]) acc[category] = { income: 0, expense: 0 };
      if (t.type === "income") {
        acc[category].income += t.amount;
      } else {
        acc[category].expense += t.amount;
      }

      return acc;
    }, {});

    return Object.entries(categories).map(([name, values]) => ({
      name,
      income: values.income,
      expense: values.expense,
    }));
  }, [filteredTransactions]);

  // Chart options for time series
  const timeSeriesOptions = useMemo<ApexOptions>(
    () => ({
      chart: {
        type: "area",
        height: CHART_HEIGHT,
        toolbar: { show: true },
        zoom: { enabled: false },
        foreColor: "#6B7280",
      },
      colors: [CHART_COLORS.income, CHART_COLORS.expense],
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 2 },
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
        labels: {
          formatter: (value: string) => {
            const timestamp = Number(value);
            return new Date(timestamp).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            });
          },
        },
      },
      yaxis: {
        labels: {
          formatter: (val: number) => `$${val.toFixed(2)}`,
        },
      },
      tooltip: {
        theme: theme === "dark" ? "dark" : "light",
        x: { format: "dd MMM yyyy" },
        y: { formatter: (val: number) => `$${val.toFixed(2)}` },
      },
      legend: { position: "top" },
    }),
    [theme]
  );

  const timeSeriesSeries = useMemo(
    () => [
      {
        name: "Income",
        data: chartData.map((d) => ({ x: d.date, y: d.income })),
      },
      {
        name: "Expense",
        data: chartData.map((d) => ({ x: d.date, y: d.expense })),
      },
    ],
    [chartData]
  );

  // Chart options for categories
  const categoryOptions = useMemo<ApexOptions>(
    () => ({
      chart: {
        type: "donut",
        height: CHART_HEIGHT,
        foreColor: "#6B7280",
      },
      colors: CATEGORY_COLORS,
      labels: getCategoryTypeLabels(categoryType, categoryData),
      legend: { position: "bottom" },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                label:
                  categoryType === "both"
                    ? "Total Amount"
                    : `Total ${categoryType}`,
                formatter: () => {
                  const total = getCategoryTypeData(
                    categoryType,
                    categoryData
                  ).reduce((sum, val) => sum + val, 0);
                  return `$${total.toFixed(2)}`;
                },
              },
            },
          },
        },
      },
      fill: {
        type: "solid",
        opacity: 1,
      },
      tooltip: {
        theme: theme === "dark" ? "dark" : "light",
        y: { formatter: (val: number) => `$${val.toFixed(2)}` },
      },
    }),
    [categoryData, categoryType, theme]
  );

  const categorySeries = useMemo(
    () => getCategoryTypeData(categoryType, categoryData),
    [categoryType, categoryData]
  );

  const categoryFilterOptions = [
    { value: "both", label: "Both", icon: FiPieChart },
    { value: "income", label: "Income", icon: FiDollarSign },
    { value: "expense", label: "Expense", icon: FiCreditCard },
  ];

  const renderTabContent = () => {
    if (activeTab === "overview") {
      return (
        <>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
            Income vs Expenses in last {timeRange}
          </h3>
          {chartData.length === 0 ? (
            <p className='text-center text-gray-500 dark:text-gray-400'>
              No transactions in this period.
            </p>
          ) : (
            <ApexChart
              options={timeSeriesOptions}
              series={timeSeriesSeries}
              type='area'
              height={CHART_HEIGHT}
            />
          )}
        </>
      );
    }

    return (
      <>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
            Spending by Category
          </h3>
          <div className='w-40 md:w-60'>
            <Select
              options={categoryFilterOptions}
              value={categoryType}
              onChange={(value) =>
                setCategoryType(value as TransactionFilterType)
              }
              placeholder='Select category type'
              size='md'
              variant='outline'
            />
          </div>
        </div>
        {categoryData.length === 0 ? (
          <p className='text-center text-gray-500 dark:text-gray-400'>
            No category data available for this period.
          </p>
        ) : (
          <ApexChart
            options={categoryOptions}
            series={categorySeries}
            type='donut'
            height={CHART_HEIGHT}
          />
        )}
      </>
    );
  };

  return (
    <div className='space-y-6 mb-6'>
      <div className='border-b border-gray-200 dark:border-gray-700'>
        <nav className='flex space-x-4'>
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "overview"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "categories"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Categories
          </button>
        </nav>
      </div>

      <div className='bg-white dark:bg-gray-900 rounded-xl shadow p-6'>
        {renderTabContent()}
      </div>
    </div>
  );
}
