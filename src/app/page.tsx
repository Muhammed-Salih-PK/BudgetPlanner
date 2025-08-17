"use client";

import { useState } from "react";
import RecentTransactions from "@/components/RecentTransactions";
import { ChartDatesType } from "@/types/transaction";
import ChartView from "@/components/ChartView";

import { FiArrowDown, FiCalendar, FiClock, FiCreditCard } from "react-icons/fi";
import { Select, SelectOption } from "@/components/ui/Select";
import SummaryChart from "@/components/SummaryChart";
import GlowText from "@/components/ui/GlowText";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState<ChartDatesType>("month");
  const timeRangeOptions: SelectOption<ChartDatesType>[] = [
    {
      value: "week",
      label: "Last Week",
      icon: <FiClock className='h-4 w-4' />,
    },
    {
      value: "month",
      label: "Last Month",
      icon: <FiCalendar className='h-4 w-4' />,
    },
    {
      value: "year",
      label: "Last Year",
      icon: <FiCalendar className='h-4 w-4' />,
    },
  ];
  const router = useRouter();
  const goToTransaction = () => {
    router.push(`/transactions`);
  };
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-[#06000f] pt-16 '>
      <div className='max-w-7xl mx-auto p-4 md:p-6 '>
        {/* Header */}
        <div className='pb-6 flex items-center justify-between'>
          <div>
            <GlowText
              content='Budget Dashboard'
              fontSize='text-2xl md:text-3xl'
              fontWeight='font-bold'
              BlurSize='dark:blur-xl blur-none'
              textColor='dark:bg-white bg-gray-800 '
              bgColor='dark:bg-[#813cf0] '
            />
            <p className='text-gray-600 dark:text-gray-400 font-figtree'>
              Track your income and expenses
            </p>
          </div>
          <div className="pr-5">
            <button
              onClick={goToTransaction}
              className='px-2 py-2 rounded-md flex items-center gap-2 bg-transparent border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            >
              <FiCreditCard /> <div className="flex items-center gap-1">
                <span>Add</span><span className="hidden sm:block">Transaction</span>
                </div>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <SummaryChart />
        <div className='flex w-full justify-end pr-5'>
          <div className='w-40 '>
            <Select
              options={timeRangeOptions}
              value={timeRange}
              onChange={setTimeRange}
              className=''
              size='md' // or "md" or "lg"
              variant='outline' // or "filled" or "ghost"
            />
          </div>
        </div>
        {/* chart  */}
        <ChartView timeRange={timeRange} />
        {/* Recent Transactions */}

        <RecentTransactions />
      </div>
    </div>
  );
}
