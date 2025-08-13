"use client";

import { useTransactionStore } from "@/store/useTransactions";
import { ITransaction, TransactionFilterType } from "@/types/transaction";
import React, { useState, useMemo } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
  FiSearch,
  FiCalendar,
  FiX,
} from "react-icons/fi";

const TransactionTable = ({ type }: { type: TransactionFilterType }) => {
  const { transactions, updateTransaction, deleteTransaction } =
    useTransactionStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ name: "", amount: 0 });
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filtered = useMemo(() => {
    let result =
      type === "both"
        ? [...transactions]
        : transactions.filter((t) => t.type === type);

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply date range filter
    if (dateRange.start) {
      result = result.filter(
        (t) => new Date(t.date) >= new Date(dateRange.start)
      );
    }
    if (dateRange.end) {
      result = result.filter(
        (t) => new Date(t.date) <= new Date(dateRange.end)
      );
    }

    return result.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [transactions, type, searchTerm, dateRange]);

  // Pagination logic
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleDelete = (t: ITransaction) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${t.name}" ($${t.amount.toFixed(2)})?`
      )
    ) {
      try {
        deleteTransaction(t.id);
        // Reset to first page if the last item on the current page is deleted
        if (currentItems.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        console.error("Failed to delete transaction:", error);
        alert("Failed to delete transaction. Please try again.");
      }
    }
  };

  const handleEditClick = (transaction: ITransaction) => {
    setEditingId(transaction.id);
    setEditValues({ name: transaction.name, amount: transaction.amount });
  };

  const handleSave = (id: string) => {
    updateTransaction(id, {
      ...transactions.find((t) => t.id === id)!,
      ...editValues,
    });
    setEditingId(null);
  };

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setDateRange({ start: "", end: "" });
    setCurrentPage(1);
  };

  return (
    <div className='overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700  shadow-sm dark:shadow-none'>
      {/* Filters Section */}
      <div className='bg-gray-50 dark:bg-gray-900 p-4 border-b dark:border-gray-700'>
        <div className='flex flex-col space-y-3'>
          <div className='flex items-center justify-between'>
            <h3 className='font-medium text-gray-700 dark:text-gray-300'>
              Filters
            </h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className='text-sm flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300'
            >
              {showFilters ? (
                <>
                  <FiX className='mr-1' /> Hide
                </>
              ) : (
                <>
                  <FiSearch className='mr-1' /> Show Filters
                </>
              )}
            </button>
          </div>

          {showFilters && (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {/* Search by Name */}
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <FiSearch className='text-gray-400 dark:text-gray-500' />
                </div>
                <input
                  type='text'
                  placeholder='Search by name and category'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 dark:text-gray-300 dark:bg-gray-700'
                />
              </div>

              {/* Date Range */}
              <div className='grid grid-cols-2 gap-2'>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <FiCalendar className='text-gray-400 dark:text-gray-500' />
                  </div>
                  <input
                    type='date'
                    placeholder='Start date'
                    value={dateRange.start}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, start: e.target.value })
                    }
                    className='block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 dark:text-gray-300 dark:bg-gray-700'
                  />
                </div>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <FiCalendar className='text-gray-400 dark:text-gray-500' />
                  </div>
                  <input
                    type='date'
                    placeholder='End date'
                    value={dateRange.end}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, end: e.target.value })
                    }
                    className='block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 dark:text-gray-300 dark:bg-gray-700'
                  />
                </div>
              </div>

              {/* Active Filters & Reset */}
              <div className='flex items-center space-x-2'>
                {(searchTerm || dateRange.start || dateRange.end) && (
                  <button
                    onClick={resetFilters}
                    className='inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                  >
                    <FiX className='mr-1' /> Reset Filters
                  </button>
                )}
                {(searchTerm || dateRange.start || dateRange.end) && (
                  <span className='text-xs text-gray-500 dark:text-gray-400'>
                    {filtered.length} results
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop/Tablet View */}
      <div className='hidden md:block'>
        <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
          <thead className='bg-gray-50 dark:bg-gray-900'>
            <tr>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
              >
                Date
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
              >
                Name
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                Category
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
              >
                Type
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
              >
                Amount
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700'>
            {currentItems.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className='px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400'
                >
                  No transactions found matching your criteria
                </td>
              </tr>
            ) : (
              currentItems.map((t) => (
                <tr
                  key={t.id}
                  className='hover:bg-gray-50 dark:hover:bg-gray-700'
                >
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100'>
                    {new Date(t.date).toLocaleDateString()}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100'>
                    {editingId === t.id ? (
                      <input
                        type='text'
                        value={editValues.name}
                        onChange={(e) =>
                          setEditValues({ ...editValues, name: e.target.value })
                        }
                        className='border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-2 py-1 w-full'
                      />
                    ) : (
                      t.name
                    )}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                    {t.category || "—"}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        t.type === "income"
                          ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300"
                          : "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300"
                      }`}
                    >
                      {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                    {editingId === t.id ? (
                      <input
                        type='number'
                        value={editValues.amount}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            amount: Number(e.target.value),
                          })
                        }
                        className='border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-2 py-1 w-full'
                      />
                    ) : (
                      <span
                        className={
                          t.type === "income"
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }
                      >
                        {t.type === "income" ? "+" : "-"}${t.amount.toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                    {editingId === t.id ? (
                      <div className='flex justify-end space-x-2'>
                        <button
                          onClick={() => setEditingId(null)}
                          className='px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSave(t.id)}
                          className='px-3 py-1 text-sm border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700'
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className='flex justify-end space-x-2'>
                        <button
                          onClick={() => handleEditClick(t)}
                          className='text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/50'
                          title='Edit'
                        >
                          <FiEdit2 className='h-4 w-4' />
                        </button>
                        <button
                          onClick={() => handleDelete(t)}
                          className='text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/50'
                          title='Delete'
                        >
                          <FiTrash2 className='h-4 w-4' />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className='md:hidden'>
        {currentItems.length === 0 ? (
          <div className='px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400'>
            No transactions found matching your criteria
          </div>
        ) : (
          <div className='space-y-2 p-2'>
            {currentItems.map((t) => (
              <div
                key={t.id}
                className='border dark:border-gray-700 rounded-lg overflow-hidden'
              >
                <div
                  className='p-3 flex justify-between items-center bg-gray-50 dark:bg-gray-900 cursor-pointer'
                  onClick={() => toggleRow(t.id)}
                >
                  <div className='flex-1'>
                    <div className='font-medium text-gray-900 dark:text-white truncate'>
                      {t.name}
                    </div>
                    <div className='text-sm text-gray-500 dark:text-gray-400'>
                      {new Date(t.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div
                    className={`ml-2 ${
                      t.type === "income"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"}${t.amount.toFixed(2)}
                  </div>
                  <div className='ml-2'>
                    {expandedRow === t.id ? (
                      <FiChevronUp className='h-5 w-5 text-gray-400 dark:text-gray-500' />
                    ) : (
                      <FiChevronDown className='h-5 w-5 text-gray-400 dark:text-gray-500' />
                    )}
                  </div>
                </div>

                {expandedRow === t.id && (
                  <div className='p-3 bg-white dark:bg-gray-900 border-t dark:border-gray-700'>
                    {editingId === t.id ? (
                      <div className='space-y-3'>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                            Name
                          </label>
                          <input
                            type='text'
                            value={editValues.name}
                            onChange={(e) =>
                              setEditValues({
                                ...editValues,
                                name: e.target.value,
                              })
                            }
                            className='w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2'
                          />
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                            Amount
                          </label>
                          <input
                            type='number'
                            value={editValues.amount}
                            onChange={(e) =>
                              setEditValues({
                                ...editValues,
                                amount: Number(e.target.value),
                              })
                            }
                            className='w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2'
                          />
                        </div>
                        <div className='flex justify-end space-x-2 pt-2'>
                          <button
                            onClick={() => setEditingId(null)}
                            className='px-3 py-1 text-sm border dark:border-gray-600 dark:text-gray-300 rounded text-gray-700 dark:bg-gray-700'
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSave(t.id)}
                            className='px-3 py-1 text-sm bg-blue-600 text-white rounded'
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className='flex justify-between space-x-4'>
                        <div className='flex space-x-2'>
                          <button
                            onClick={() => handleEditClick(t)}
                            className='p-2 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/50'
                            title='Edit'
                          >
                            <FiEdit2 className='h-4 w-4' />
                          </button>
                          <button
                            onClick={() => handleDelete(t)}
                            className='p-2 text-red-600 dark:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-red-900/50'
                            title='Delete'
                          >
                            <FiTrash2 className='h-4 w-4' />
                          </button>
                        </div>

                        <div className='text-sm text-gray-500 dark:text-gray-400 self-center flex gap-1'>
                          <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300'>
                            {t.category || "---"}
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              t.type === "income"
                                ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300"
                                : "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300"
                            }`}
                          >
                            {t.type === "income" ? "Income" : "Expense"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {filtered.length > 0 && (
        <div className='bg-white dark:bg-gray-900 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6'>
          <div className='flex-1 flex justify-between sm:hidden'>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              Next
            </button>
          </div>
          <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
            <div className='flex items-center'>
              <span className='text-sm text-gray-700 dark:text-gray-300 mr-2'>
                Rows per page:
              </span>
              <div className='relative'>
                <select
                  id='items-per-page'
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className='block w-20 pl-3 pr-8 py-1 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md  dark:text-gray-300 appearance-none bg-white dark:bg-gray-700'
                >
                  {[5, 10, 20, 50].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300'>
                  <FiChevronDown className='h-4 w-4' />
                </div>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 text-sm rounded-md ${
                  currentPage === 1
                    ? "text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                    : "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                Previous
              </button>

              <div className='px-3 py-1 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md'>
                Page {currentPage} of {totalPages}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 text-sm rounded-md ${
                  currentPage === totalPages
                    ? "text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                    : "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
