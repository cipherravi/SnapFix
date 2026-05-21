import BackButton from "../../components/Buttons/BackButton";
import TransactionCard from "../../components/profile/TransactionCard";
import { useGetTransactionsQuery } from "../../services/api/transactionApi";
import { useState, useMemo } from "react";
import TransactionFilterModal from "../../components/modals/TransactionFilterModal";
import WalletTransactionShimmer from "../../components/shimmer/WalletTransactionShimmer";

interface Transaction {
  amount: number;
  createdAt: string;
  id: number;
  newBalance: number;
  previousBalance: number;
  purpose: string;
  reference: string;
  status: string;
  transactionType: string;
  updatedAt: string;
  walletId: number;
}

const FILTERS = ["Recent", "Last Week", "Last Month", "Custom"];

const WalletTransaction = () => {
  const [activeFilter, setActiveFilter] = useState("Recent");
  const [customFilters, setCustomFilters] = useState<any>({});
  const [showModal, setShowModal] = useState(false);

  const filterParams = useMemo(() => {
    if (activeFilter === "Custom") return customFilters;

    const now = new Date();

    switch (activeFilter) {
      case "Last Week":
        return { startDate: new Date(now.getTime() - 7 * 86400000) };
      case "Last Month":
        return { startDate: new Date(now.getTime() - 30 * 86400000) };
      case "Recent":
      default:
        return { sortBy: "createdAt", sortOrder: "DESC", limit: 10 };
    }
  }, [activeFilter, customFilters]);

  const { data: transactions, isLoading } =
    useGetTransactionsQuery(filterParams);

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-white px-4 sm:px-6 md:px-10 py-6">
      {/* Header */}
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-2">
        <BackButton navigateTo="/profile" />
        <h1 className="text-2xl sm:text-3xl poppins-bold">Transactions</h1>
        <p className="text-gray-600 text-sm sm:text-base mb-4">
          View and manage all your recent transactions
        </p>
      </div>

      <div className="w-full max-w-3xl">
        {/* Filter Buttons */}
        <div className="w-full overflow-x-auto flex gap-3 px-2 py-1 mb-4 hide-scrollbar">
          {FILTERS.map((item) => {
            const isActive = item === activeFilter;
            return (
              <button
                key={item}
                onClick={() => {
                  setActiveFilter(item);
                  if (item === "Custom") setShowModal(true);
                }}
                className={`
                  px-4 py-1.5 rounded-2xl text-sm font-medium transition-all
                  backdrop-blur-md border shadow-sm whitespace-nowrap
                
                  ${
                    isActive
                      ? "bg-gray-900 text-white border-gray-700 shadow-md scale-[1.04]"
                      : "bg-white/40 text-gray-700 border-gray-300 hover:bg-white/60"
                  }
                `}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* Transaction Cards */}
        <div className="flex-1 overflow-y-auto md:px-4">
          {isLoading ? (
            <WalletTransactionShimmer />
          ) : (
            transactions?.map((txn: Transaction) => (
              <TransactionCard key={txn.id} {...txn} />
            ))
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <TransactionFilterModal
            initialFilters={customFilters}
            onClose={() => setShowModal(false)}
            onApply={(filters) => {
              setCustomFilters(filters);
              setActiveFilter("Custom");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default WalletTransaction;
