"use client";

import { useState } from "react";
import Card from "@/components/common/card";
import Modal from "@/components/common/modal";
import PaymentForm from "@/components/fees/payment-form";
import { DollarSign, Calendar, CheckCircle, AlertCircle, Clock, FileText } from "lucide-react";
import EmptyState from "@/components/common/empty-state";
import { useToast } from "@/contexts/toast-context";

/**
 * Fees View Component
 * 
 * Displays fee information and payment management for students.
 * 
 * Features:
 * - Summary cards (Total Pending, Total Paid, Pending Count)
 * - Current Fees tab (pending and overdue fees)
 * - Payment History tab (completed payments)
 * - Pay Now functionality with payment form
 * - Fee details (type, amount, due date, status)
 * - Payment method selection
 * - Transaction details
 * 
 * Tabs:
 * - Current Fees: Shows pending and overdue fees with Pay Now button
 * - Payment History: Shows completed payments with transaction details
 */

export default function FeesView() {
  const [activeTab, setActiveTab] = useState("current"); // Tab: "current" | "history"
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  const currentFees = [
    {
      id: 1,
      type: "Tuition Fee",
      semester: "Fall 2024",
      amount: 50000,
      dueDate: "2024-12-31",
      status: "pending",
      description: "Semester tuition fee",
    },
    {
      id: 2,
      type: "Lab Fee",
      semester: "Fall 2024",
      amount: 5000,
      dueDate: "2024-12-25",
      status: "overdue",
      description: "Computer lab and equipment fee",
    },
    {
      id: 3,
      type: "Library Fee",
      semester: "Fall 2024",
      amount: 2000,
      dueDate: "2025-01-15",
      status: "pending",
      description: "Library access and resources fee",
    },
  ];

  const paymentHistory = [
    {
      id: 1,
      type: "Tuition Fee",
      semester: "Spring 2024",
      amount: 50000,
      paidDate: "2024-03-15",
      paymentMethod: "Bank Transfer",
      transactionId: "TXN-2024-001234",
      status: "paid",
    },
    {
      id: 2,
      type: "Lab Fee",
      semester: "Spring 2024",
      amount: 5000,
      paidDate: "2024-03-10",
      paymentMethod: "Online Payment",
      transactionId: "TXN-2024-001189",
      status: "paid",
    },
    {
      id: 3,
      type: "Library Fee",
      semester: "Spring 2024",
      amount: 2000,
      paidDate: "2024-03-08",
      paymentMethod: "Cash",
      transactionId: "CASH-2024-000567",
      status: "paid",
    },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalPending = currentFees
    .filter((fee) => fee.status === "pending" || fee.status === "overdue")
    .reduce((sum, fee) => sum + fee.amount, 0);

  const totalPaid = paymentHistory.reduce((sum, payment) => sum + payment.amount, 0);

  const handlePayment = async (paymentData) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // await api.post('/fees/pay', paymentData);
      console.log("Payment data:", paymentData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate transaction ID
      const transactionId = `TXN-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`;

      // Move fee from currentFees to paymentHistory (in real app, this would be handled by backend)
      // For now, we'll just show success message
      
      setIsPaymentModalOpen(false);
      setSelectedFee(null);
      success(`Payment of ${formatCurrency(paymentData.amount)} processed successfully! Transaction ID: ${transactionId}`);
      
      // In a real app, you would refresh the data from the API
    } catch (err) {
      console.error("Payment error:", err);
      error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header Section with proper spacing */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">Fee Management</h1>
        <p className="text-sm sm:text-base text-gray-600">
          View and manage your fee payments and payment history
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-indigo-100 text-xs sm:text-sm">Total Pending</p>
              <p className="text-2xl sm:text-3xl font-bold mt-1 truncate">{formatCurrency(totalPending)}</p>
            </div>
            <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-indigo-200 flex-shrink-0 ml-2" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-green-100 text-xs sm:text-sm">Total Paid</p>
              <p className="text-2xl sm:text-3xl font-bold mt-1 truncate">{formatCurrency(totalPaid)}</p>
            </div>
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-green-200 flex-shrink-0 ml-2" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-blue-100 text-xs sm:text-sm">Pending Fees</p>
              <p className="text-2xl sm:text-3xl font-bold mt-1">
                {currentFees.filter((f) => f.status !== "paid").length}
              </p>
            </div>
            <FileText className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-200 flex-shrink-0 ml-2" />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1 sm:space-x-2 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("current")}
          className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-center ${
            activeTab === "current"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
          <span className="truncate">Current Fees</span>
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-center ${
            activeTab === "history"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
          <span className="truncate">Payment History</span>
        </button>
      </div>

      {/* Current Fees Tab */}
      {activeTab === "current" && (
        <div className="space-y-4">
          {currentFees.length === 0 ? (
            <Card>
              <EmptyState
                icon={DollarSign}
                title="No pending fees"
                description="You don't have any pending fees at the moment."
              />
            </Card>
          ) : (
            currentFees.map((fee) => (
              <Card key={fee.id}>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0">
                    <div className="flex items-start space-x-2 sm:space-x-3 min-w-0 flex-1">
                      <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                        <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                          {fee.type}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">{fee.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{fee.semester}</p>
                      </div>
                    </div>
                    <span
                      className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap flex-shrink-0 ${getStatusColor(
                        fee.status
                      )}`}
                    >
                      {fee.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-200">
                    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-1.5 sm:space-x-2 mb-2">
                        <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Amount
                        </p>
                      </div>
                      <p className="text-lg sm:text-xl font-bold text-gray-900 break-words">
                        {formatCurrency(fee.amount)}
                      </p>
                    </div>
                    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-1.5 sm:space-x-2 mb-2">
                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Due Date
                        </p>
                      </div>
                      <p className="text-sm sm:text-base font-semibold text-gray-900">
                        {formatDate(fee.dueDate)}
                      </p>
                      {fee.status === "overdue" && (
                        <p className="text-xs text-red-600 mt-1 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                          Overdue
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-2 sm:pt-3 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setSelectedFee(fee);
                        setIsPaymentModalOpen(true);
                      }}
                      className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                    >
                      Pay Now
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Payment History Tab */}
      {activeTab === "history" && (
        <div className="space-y-4">
          {paymentHistory.length === 0 ? (
            <Card>
              <EmptyState
                icon={FileText}
                title="No payment history"
                description="You haven't made any payments yet."
              />
            </Card>
          ) : (
            paymentHistory.map((payment) => (
              <Card key={payment.id}>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {payment.type}
                        </h3>
                        <p className="text-sm text-gray-600">{payment.semester}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Transaction ID: {payment.transactionId}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-md">
                      {payment.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-200">
                    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-1.5 sm:space-x-2 mb-2">
                        <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Amount Paid
                        </p>
                      </div>
                      <p className="text-lg sm:text-xl font-bold text-gray-900 break-words">
                        {formatCurrency(payment.amount)}
                      </p>
                    </div>
                    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-1.5 sm:space-x-2 mb-2">
                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Payment Date
                        </p>
                      </div>
                      <p className="text-sm sm:text-base font-semibold text-gray-900">
                        {formatDate(payment.paidDate)}
                      </p>
                    </div>
                    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 sm:col-span-2 lg:col-span-1">
                      <div className="flex items-center space-x-1.5 sm:space-x-2 mb-2">
                        <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Payment Method
                        </p>
                      </div>
                      <p className="text-sm sm:text-base font-semibold text-gray-900 break-words">
                        {payment.paymentMethod}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Payment Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedFee(null);
        }}
        title="Make Payment"
        size="lg"
      >
        {selectedFee && (
          <PaymentForm
            fee={selectedFee}
            onSubmit={handlePayment}
            onCancel={() => {
              setIsPaymentModalOpen(false);
              setSelectedFee(null);
            }}
            loading={loading}
          />
        )}
      </Modal>
    </div>
  );
}

