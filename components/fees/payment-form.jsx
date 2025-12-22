"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/components/common/button";
import Select from "@/components/common/select";
import Loading from "@/components/common/loading";
import { CreditCard, Building2, Wallet } from "lucide-react";

const paymentSchema = yup.object().shape({
  paymentMethod: yup.string().required("Please select a payment method"),
});

export default function PaymentForm({
  fee,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(paymentSchema),
    defaultValues: {
      paymentMethod: "",
    },
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleFormSubmit = async (data) => {
    await onSubmit({ ...data, feeId: fee.id, amount: fee.amount });
    reset();
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Fee Summary */}
      <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Fee Type:</span>
          <span className="text-sm font-semibold text-gray-900">{fee.type}</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Semester:</span>
          <span className="text-sm font-semibold text-gray-900">{fee.semester}</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-indigo-200">
          <span className="text-base font-bold text-gray-900">Total Amount:</span>
          <span className="text-xl font-bold text-indigo-600">
            {formatCurrency(fee.amount)}
          </span>
        </div>
      </div>

      {/* Payment Method */}
      <Select
        label="Payment Method"
        name="paymentMethod"
        register={register}
        placeholder="Select payment method"
        options={[
          { value: "bank_transfer", label: "Bank Transfer" },
          { value: "online_payment", label: "Online Payment" },
          { value: "cash", label: "Cash Payment" },
          { value: "easypaisa", label: "EasyPaisa" },
          { value: "jazzcash", label: "JazzCash" },
        ]}
        error={errors.paymentMethod?.message}
        required
      />

      {/* Payment Method Info */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm font-medium text-gray-700 mb-2">Payment Instructions:</p>
        <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
          <li>Bank Transfer: Use account number 1234567890 (HBL Bank)</li>
          <li>Online Payment: You will be redirected to payment gateway</li>
          <li>Cash: Visit accounts office during working hours</li>
          <li>EasyPaisa/JazzCash: Send payment to 0300-1234567</li>
        </ul>
      </div>

      {/* Terms and Conditions */}
      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          id="terms"
          required
          className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:outline-none"
        />
        <label htmlFor="terms" className="text-sm text-gray-600">
          I agree to the payment terms and conditions
        </label>
      </div>

      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && (
            <span className="mr-2">
              <Loading size="sm" />
            </span>
          )}
          Confirm Payment
        </Button>
      </div>
    </form>
  );
}

