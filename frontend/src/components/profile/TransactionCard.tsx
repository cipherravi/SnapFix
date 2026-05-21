import React from "react";
import getStatusColor from "../../utils/common/getStatusColor";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface TransactionCardProps {
  amount: number;
  id: number;
  newBalance: number;
  previousBalance: number;
  purpose: string;
  status: string;
  transactionType: string;
  createdAt: string;
  updatedAt: string;
}

const TransactionCard: React.FC<TransactionCardProps> = (props) => {
  const {
    amount,
    purpose,
    status,
    transactionType,
    newBalance,
    previousBalance,
    createdAt,
  } = props;

  const isCredit = transactionType?.toLowerCase() === "credit";

  return (
    <div
      className={`
        relative w-full rounded-2xl p-5 mb-4 
        backdrop-blur-sm bg-white/30 border border-white/40
        transition-all duration-300 
        hover:scale-[1.02] hover:shadow-[0_8px_25px_rgba(0,0,0,0.12)]
      `}
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div
            className={`
              w-11 h-11 flex items-center justify-center rounded-xl 
              backdrop-blur-md border 
              ${
                isCredit
                  ? "bg-emerald-100/40 text-emerald-600 border-emerald-300/40"
                  : "bg-rose-100/40 text-rose-600 border-rose-300/40"
              }
            `}
          >
            {isCredit ? (
              <ArrowDownRight size={20} />
            ) : (
              <ArrowUpRight size={20} />
            )}
          </div>

          <div>
            <p className="text-xs text-gray-500">Purpose</p>
            <p className="text-lg font-semibold text-gray-800">{purpose}</p>
          </div>
        </div>

        {/* Status Tag — upgraded to glassmorphic button style */}
        <span
          className={`
            px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide
            backdrop-blur-md border shadow-sm
            ${getStatusColor(status)}
          `}
        >
          {status}
        </span>
      </div>

      {/* Amount */}
      <div className="mt-4">
        <p className="text-xs text-gray-500">Amount</p>
        <p
          className={`text-2xl font-bold ${
            isCredit ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {isCredit ? "+" : "-"} ₹{amount.toLocaleString()}
        </p>
      </div>

      {/* Balances */}
      <div className="grid grid-cols-2 gap-4 mt-5">
        {/* Previous Balance */}
        <div
          className="
          rounded-xl p-3 backdrop-blur-lg border border-gray-200/60 
          bg-white/50  
        "
        >
          <p className="text-[11px] text-gray-500">Previous Balance</p>
          <p className="font-medium text-gray-800">
            ₹{Number(previousBalance).toLocaleString()}
          </p>
        </div>

        {/* New Balance */}
        <div
          className="
          rounded-xl p-3 backdrop-blur-lg border border-gray-200/60 
          bg-white/50  
        "
        >
          <p className="text-[11px] text-gray-500">New Balance</p>
          <p className="font-medium text-gray-800">
            ₹{Number(newBalance).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Footer Date */}
      <div className="mt-4 border-t border-gray-200 pt-3">
        <p className="text-[11px] text-gray-500">
          {new Date(createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default TransactionCard;
