"use client";

import TransactionForm from "@/components/TransactionForm";
import TransactionTable from "@/components/TransactionTable";
import { useState } from "react";
import { TransactionFilterType } from "@/types/transaction";

import { FiPieChart, FiArrowUp, FiArrowDown } from "react-icons/fi";

import SummaryCard from "@/components/SummaryCard";
import { Select } from "@/components/ui/Select";
import GlowText from "@/components/ui/GlowText";

export default function Page() {
  const [type, setType] = useState<TransactionFilterType>("both");
  const transactionFilterOptions = [
    {
      value: "both",
      label: "All Transactions",
      icon: <FiPieChart className='h-4 w-4 ' />,
    },
    {
      value: "income",
      label: "Income Only",
      icon: <FiArrowUp className='h-4 w-4 ' />,
    },
    {
      value: "expense",
      label: "Expenses Only",
      icon: <FiArrowDown className='h-4 w-4 ' />,
    },
  ];
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-[#06000f] pt-16'>
      <div className='max-w-7xl mx-auto  p-4 md:p-6 '>
        {/* Header */}
        <header className='mb-6 sm:mb-8'>
          <GlowText
            fontSize='text-2xl md:text-3xl'
            fontWeight='font-bold'
            content='Budget Planner'
            BlurSize='dark:blur-xl blur-none'
            textColor='dark:bg-white bg-gray-800'
            bgColor='dark:bg-[#813cf0] '
          />
          
          <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400'>
            Manage your transactions
          </p>
        </header>

        {/* Financial Summary Cards - Mobile First */}
        <SummaryCard />

        {/* Main Content */}
        <div className='grid grid-cols-1 gap-6'>
          {/* Form Section */}
          <div className='bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
            <h2 className='text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-white'>
              Add New Transaction
            </h2>
            <TransactionForm />
          </div>

          {/* Table Section */}
          <div className='bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4'>
              <h2 className='text-lg sm:text-xl font-semibold text-gray-800 dark:text-white'>
                All Transactions
              </h2>
              <div className='relative w-full sm:w-48'>
                <Select
                  options={transactionFilterOptions}
                  value={type}
                  onChange={(value) => setType(value as TransactionFilterType)}
                  className=''
                />
            
              </div>
            </div>

            <TransactionTable type={type} />
          </div>
        </div>
      </div>
    </div>
  );
}
