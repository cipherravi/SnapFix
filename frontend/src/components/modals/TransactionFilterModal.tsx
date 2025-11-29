import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";

interface TransactionFilterModalProps {
  onClose: () => void;
  onApply: (filters: any) => void;
  initialFilters?: {
    transaction_type?: string | null;
    minAmount?: string | number;
    maxAmount?: string | number;
    startDate?: string;
    endDate?: string;
  };
}

const TransactionFilterModal: React.FC<TransactionFilterModalProps> = ({
  onClose,
  onApply,
  initialFilters = {},
}) => {
  const [transactionType, setTransactionType] = useState<string | null>(null);
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Initialize from parent filters
  useEffect(() => {
    setTransactionType(initialFilters.transaction_type || null);
    setMinAmount(initialFilters.minAmount?.toString() || "");
    setMaxAmount(initialFilters.maxAmount?.toString() || "");
    setStartDate(initialFilters.startDate || "");
    setEndDate(initialFilters.endDate || "");
  }, [initialFilters]);

  const applyFilters = useCallback(() => {
    onApply({
      transaction_type: transactionType || undefined,
      minAmount: minAmount || undefined,
      maxAmount: maxAmount || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
    onClose();
  }, [
    transactionType,
    minAmount,
    maxAmount,
    startDate,
    endDate,
    onApply,
    onClose,
  ]);

  const resetFilters = () => {
    setTransactionType(null);
    setMinAmount("");
    setMaxAmount("");
    setStartDate("");
    setEndDate("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      applyFilters();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="transaction-filter-title"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div
        className="
          w-full max-w-md 
          bg-white/50 sm:bg-white/30 
          backdrop-blur-xl sm:backdrop-blur-xl 
          border border-white/40 
          rounded-2xl p-6 shadow-xl m-2 animate-scaleIn
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2
            id="transaction-filter-title"
            className="text-xl font-semibold text-gray-900 sm:text-gray-800"
          >
            Custom Filters
          </h2>
          <button
            onClick={onClose}
            aria-label="Close filter modal"
            className="focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-full p-1"
          >
            <X className="text-gray-600 hover:text-black" />
          </button>
        </div>

        {/* Transaction Type */}
        <div className="mb-5">
          <label className="text-sm text-gray-900 sm:text-gray-700 mb-2 block">
            Transaction Type
          </label>
          <div className="flex gap-3">
            {["credit", "debit"].map((type) => (
              <button
                key={type}
                onClick={() => setTransactionType(type)}
                aria-pressed={transactionType === type}
                className={`
                  px-4 py-2 rounded-xl border text-sm font-medium
                  ${
                    transactionType === type
                      ? "bg-gray-900 text-white border-gray-800"
                      : "bg-white/90 sm:bg-white/40 border-gray-300 text-gray-700 hover:bg-white/60"
                  }
                `}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Amount Range */}
        <div className="mb-5">
          <label className="text-sm text-gray-900 sm:text-gray-700 block mb-2">
            Amount Range
          </label>
          <div className="flex gap-3">
            <input
              type="number"
              placeholder="Min"
              className="w-full p-2 rounded-xl bg-white/90 sm:bg-white/50 border border-gray-300"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max"
              className="w-full p-2 rounded-xl bg-white/90 sm:bg-white/50 border border-gray-300"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
            />
          </div>
        </div>

        {/* Date Range */}
        <div className="mb-5">
          <label className="text-sm text-gray-900 sm:text-gray-700 block mb-2">
            Date Range
          </label>
          <div className="flex gap-3">
            <input
              type="date"
              className="w-full p-2 rounded-xl bg-white/90 sm:bg-white/50 border border-gray-300"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              className="w-full p-2 rounded-xl bg-white/90 sm:bg-white/50 border border-gray-300"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-sm rounded-xl bg-yellow-200 hover:bg-yellow-300"
          >
            Reset
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-xl bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={applyFilters}
            className="px-5 py-2 text-sm rounded-xl bg-gray-900 text-white font-medium hover:bg-black transition"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionFilterModal;
