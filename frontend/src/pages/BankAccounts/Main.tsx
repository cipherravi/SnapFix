import BackButton from "../../components/Buttons/BackButton";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../components/modals/ConfirmModal";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import useBankDetailsFetcher from "../../utils/Hooks/useBankDetailsFetcher";
import { useGetAllBankAccountsQuery } from "../../services/api/workers";
import { type Account } from "../../../types";

const BankAccountsMain = () => {
  const navigate = useNavigate();
  const token = useSelector((s: RootState) => s.auth.token);
  const { fetchBankAccounts } = useBankDetailsFetcher();

  const { data: fetchedBankAccounts, isLoading } = useGetAllBankAccountsQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
      skip: !token,
    }
  );
  const [accounts, setAccounts] = useState<Account[]>();

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    if (fetchedBankAccounts) setAccounts(fetchedBankAccounts);
  }, [fetchedBankAccounts]);

  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;
    try {
      const response = await fetch(
        `${VITE_API_BASE_URL}/api/v1/workers/bank-details/${selectedId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || "Account removed successfully");
        if (accounts) {
          const remainingAccounts = accounts.filter(
            (account) => account.id !== selectedId
          );
          setAccounts(remainingAccounts);
        }
      } else {
        toast.error(data.message || "Failed to remove account");
      }
    } catch (error) {
      toast.error("Something went wrong while removing account");
    } finally {
      setShowConfirm(false);
      setSelectedId(null);
    }
  };

  //   const bankAccounts = async () => {
  //     try {
  //       const accounts = await fetch(
  //         `${VITE_API_BASE_URL}/api/v1/workers/bank-details`,
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       const data = await accounts.json();
  //       setAccounts(data.data);
  //     } catch (error) {
  //       toast.error("Failed to load bank accounts");
  //     }
  //   };

  //   useEffect(() => {
  //     bankAccounts();
  //   }, []);

  return (
    <div className="w-full min-h-screen flex flex-col bg-white items-center px-4 sm:px-6 md:px-10 py-6">
      {/* Header */}
      <div className="w-full max-w-3xl flex flex-col gap-2">
        <BackButton navigateTo="/profile" />
        <h1 className="text-2xl sm:text-3xl poppins-bold">Bank Accounts</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Manage your saved bank account details
        </p>
      </div>

      {/* Address List */}
      <div className="w-full max-w-3xl flex flex-col gap-4 mt-6">
        {accounts && accounts.length > 0 ? (
          accounts.map((account) => (
            <div
              key={account.id}
              className="relative bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              {/* Top Row */}
              <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col gap-1">
                  <h2 className="text-lg font-medium text-gray-900">
                    {account.bankName}
                  </h2>
                  <p className="text-sm text-gray-700">
                    {account.accountHolder}
                  </p>
                  <p className="text-sm text-gray-500">
                    **** **** {String(account.accountNumber).slice(-4)}
                  </p>
                  <p className="text-xs text-gray-400">IFSC: {account.ifsc}</p>
                </div>

                {/* Actions */}
                <button
                  onClick={() => handleDeleteClick(account.id)}
                  className="rounded-full bg-red-100 p-2 hover:bg-red-200 transition"
                  aria-label="Delete bank account"
                >
                  <img src="/svg/delete.svg" alt="Delete" className="w-5" />
                </button>
              </div>

              {/* Badges */}
              <div className="flex gap-2 mt-3">
                {account.isPrimary && (
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                    Primary
                  </span>
                )}
                {account.isActive ? (
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                    Active
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-600">
                    Inactive
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="text-base">No bank accounts found</p>
            <p className="text-sm mt-1">
              Add a bank account to receive payments
            </p>
          </div>
        )}

        {/* Add Bank Account Button */}
        <div className="w-full flex justify-center mt-6">
          <button
            className="w-full sm:w-1/2 py-3 px-6 sm:px-10 bg-[#0385c2] rounded-2xl text-xl sm:text-2xl text-white inter-medium cursor-pointer transition-transform active:scale-95"
            onClick={() => navigate("add")}
          >
            Add Bank Account
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowConfirm(false);
          setSelectedId(null);
        }}
        message="Are you sure you want to remove this Account?"
      />
    </div>
  );
};

export default BankAccountsMain;
