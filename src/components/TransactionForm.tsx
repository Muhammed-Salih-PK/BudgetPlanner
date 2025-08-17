"use client";
import { useTransactionStore } from "@/store/useTransactions";
import { CategoryType, FormState, TransactionTypes } from "@/types/transaction";
import React, { useState } from "react";
import { Select, SelectOption } from "./ui/Select";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiShoppingBag,
  FiTruck,
  FiDollarSign,
  FiCreditCard,
  FiHome,
  FiMoreHorizontal,
} from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";

export default function TransactionForm() {
  const addTransaction = useTransactionStore((s) => s.addTransaction);
  const [form, setForm] = useState<FormState>({
    date: new Date().toISOString().split("T")[0], // Default to today's date
    name: "",
    amount: "",
    type: "expense",
    category: "",
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date || !form.name || !form.amount) return;

    addTransaction({
      date: form.date,
      name: form.name.trim(),
      amount: Number(form.amount),
      type: form.type,
      category: form.category,
    });
    setForm((prev) => ({ ...prev, name: "", amount: "", category: "" })); // Keep date and type
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const transactionTypeOptions: SelectOption<TransactionTypes>[] = [
    {
      value: "expense",
      label: "Expense",
      icon: <FiArrowDown className='h-4 w-4 ' />,
    },
    {
      value: "income",
      label: "Income",
      icon: <FiArrowUp className='h-4 w-4 ' />,
    },
  ];

  const categoryOptions: SelectOption<CategoryType>[] = [
    { value: "", label: "Select category" },
    {
      value: "Food",
      label: "Food",
      icon: <FiShoppingBag className='h-4 w-4 ' />,
    },
    {
      value: "Transport",
      label: "Transport",
      icon: <FiTruck className='h-4 w-4' />,
    },
    {
      value: "Salary",
      label: "Salary",
      icon: <FiDollarSign className='h-4 w-4' />,
    },
    {
      value: "Shopping",
      label: "Shopping",
      icon: <FiCreditCard className='h-4 w-4 ' />,
    },
    {
      value: "Bills",
      label: "Bills",
      icon: <FiHome className='h-4 w-4 ' />,
    },
    {
      value: "Other",
      label: "Other",
      icon: <FiMoreHorizontal className='h-4 w-4 ' />,
    },
  ];
  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className='mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 
                 border border-emerald-200 dark:border-emerald-800 
                 rounded-lg flex items-start gap-3'
          >
            <FaCheckCircle className='text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0' />
            <p className='text-emerald-700 dark:text-emerald-300'>
              Transaction added successfully!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
        {/* Transaction Type */}
        <div className='relative'>
          <label
            htmlFor='type'
            className='block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1'
          >
            Type
          </label>
          <Select
            options={transactionTypeOptions}
            value={form.type}
            onChange={(value) => setForm({ ...form, type: value })}
            className='w-full  '
          />
        </div>

        {/* Date */}
        <div className='relative'>
          <label
            htmlFor='date'
            className='block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1'
          >
            Date
          </label>
          <input
            id='date'
            type='date'
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700'
          />
        </div>

        {/* Name */}
        <div className='relative md:col-span-2'>
          <label
            htmlFor='name'
            className='block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1'
          >
            Name
          </label>
          <input
            id='name'
            type='text'
            placeholder='e.g. Groceries, Salary'
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className='w-full px-3 py-2 border border-gray-300 dark:text-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700'
          />
        </div>

        {/* Amount */}
        <div className='relative'>
          <label
            htmlFor='amount'
            className='block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1'
          >
            Amount
          </label>
          <div className='relative rounded-md shadow-sm'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <span className='text-gray-500 sm:text-sm'>$</span>
            </div>
            <input
              id='amount'
              type='number'
              placeholder='0.00'
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className='block w-full pl-7 pr-1 py-2 border border-gray-300 dark:text-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700'
              step='1'
              min='0'
            />
          </div>
        </div>
      </div>
      {/* Category */}
      <div className='relative'>
        <label
          htmlFor='category'
          className='block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1'
        >
          Category
        </label>
        <Select
          options={categoryOptions}
          value={form.category}
          onChange={(value) => setForm({ ...form, category: value })}
          className='w-full '
        />
      </div>

      {/* Submit Button */}
      <div className='flex justify-end'>
        <button
          type='submit'
          disabled={!form.date || !form.name || !form.amount || !form.category}
          className='px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
        >
          Add Transaction
        </button>
      </div>
    </form>
  );
}
