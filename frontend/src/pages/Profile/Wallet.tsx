import BackButton from "../../components/Buttons/BackButton";
import ManageFundsModal from "../../components/modals/ManageFundsModal";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useWalletFetcher from "../../utils/Hooks/useWalletFetcher";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import { useSelector } from "react-redux";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Wallet = () => {
  const userData = useSelector((s: any) => s.user.userData);
  const { data, error, loading, refetch } = useWalletFetcher();
  console.log(loading);
  const [balance, setBalance] = useState<number | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] =
    useState<boolean>(false);
  const [handling, setHandling] = useState(false);

  useEffect(() => {
    if (data && typeof data.balance !== null) {
      setBalance(data.balance);
    }
  }, [data]);

  useEffect(() => {
    if (error) toast.error("Failed to load wallet balance. Please try again!");
  }, [error]);

  const confirmAdd = async () => {
    setHandling(true);
    try {
      if (amount < 100) return toast.error("Minimum ₹100 allowed");

      const res = await fetch(`${VITE_API_BASE_URL}/api/v1/wallet/add-money`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, purpose: "add_balance" }),
      });

      const data = await res.json();
      if (res.ok && data?.data) {
        const order = data?.data;
        handlePayment(
          order.walletId,
          Number(order.amount),
          order.razorpay_order_id,
          order.id
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setHandling(false);
      setAmount(0);
      setIsAddModalOpen(false);
    }
  };

  async function confirmWithdawal() {
    setHandling(true);
    try {
      if (balance === null || amount <= 0 || amount > balance)
        return toast.error("Enter valid amount");
      if (amount < 200) return toast.error("Minimum ₹200 withdrawal allowed");

      const res = await fetch(
        `${VITE_API_BASE_URL}/api/v1/wallet/withdraw-money`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, purpose: "withdrawal" }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        await refetch();
        toast.success(data.message);
      } else toast.error(data.message);
    } finally {
      setHandling(false);
      setAmount(0);
      setIsWithdrawalModalOpen(false);
    }
  }

  async function confirmPay() {
    setHandling(true);
    try {
      const res = await fetch(`${VITE_API_BASE_URL}/api/v1/wallet/pay-debt`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, purpose: "repayment" }),
      });

      const data = await res.json();
      if (res.ok && data?.data) {
        const order = data?.data;
        handlePayment(
          order.walletId,
          Number(order.amount),
          order.razorpay_order_id,
          order.id
        );
      }
    } finally {
      setHandling(false);
    }
  }

  async function handlePayment(
    walletId: number,
    amount: number,
    order_id: string,
    id: number
  ) {
    try {
      const options = {
        key: "rzp_test_REMwhCk2iZqINK",
        amount,
        currency: "INR",
        name: "Snapfix",
        description: "Test Transaction",
        order_id,
        theme: { color: "#0385C2" },
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch(
              `${VITE_API_BASE_URL}/api/v1/wallet/verify`,
              {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  id,
                  walletId,
                  amount,
                }),
              }
            );

            const data = await verifyRes.json();
            if (verifyRes.ok) {
              await refetch();
              toast.success("Amount added successfully 🎉");
            } else toast.error(data?.message);
          } catch (err) {
            toast.error("Verification failed");
          }
        },
        modal: {
          ondismiss: () => toast.error("Payment cancelled"),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
    }
  }

  const onCancel = () => {
    setIsAddModalOpen(false);
    setIsWithdrawalModalOpen(false);
    setAmount(0);
  };

  return (
    <div className="w-full h-screen flex flex-col bg-linear-to-b from-[#0F8DD8] to-[#0C6FB0] relative overflow-hidden">
      {/* Back Button */}
      <div className="absolute top-4 left-3 z-50  bg-white/10 rounded-full invert shadow-lg">
        <BackButton navigateTo="/profile" />
      </div>

      {/* HEADER + BALANCE CARD */}
      <div className="pt-28 px-6 text-white w-full flex flex-col items-center">
        {/* === ULTRA PREMIUM BALANCE CARD === */}
        <div
          className="
      mt-5 relative w-full max-w-md
      bg-white/10 backdrop-blur-2xl 
      rounded-3xl p-7
      border border-white/20 
      shadow-[0_15px_40px_rgba(0,0,0,0.25)]
      overflow-hidden
      animate-fadeIn
    "
        >
          {/* Animated glow ring */}
          <div
            className="
        absolute -top-20 right-10 
        w-56 h-56 rounded-full 
        bg-linear-to-br from-white/30 to-transparent 
        blur-2xl opacity-40
        animate-pulse-slow
      "
          />

          {/* Bottom glow */}
          <div
            className="
        absolute bottom-0 left-0 right-0 h-14 
        bg-linear-to-t from-white/10 to-transparent
      "
          />

          {/* BALANCE */}
          <div className="relative z-20 text-center">
            <p className="text-white/80 text-sm tracking-wide">
              Available Balance
            </p>

            <div className="flex justify-center items-end gap-2 mt-1">
              <span className="text-white text-4xl font-extrabold drop-shadow-md">
                ₹
              </span>

              {loading || balance === null ? (
                <div className="w-32 h-10 bg-white/30 rounded-xl animate-pulse"></div>
              ) : (
                <span
                  className={`
            text-5xl font-extrabold tracking-tight drop-shadow-xl
            ${(balance ?? 0) > 0 ? "text-green-300" : "text-red-300"}
          `}
                >
                  {balance ?? 0}
                </span>
              )}
            </div>
            <p className="text-white/70 text-xs mt-2">
              Updated automatically • Secure Wallet
            </p>
          </div>

          {/* PROGRESS INDICATOR */}
          <div className="relative z-20 mt-6">
            <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
              <div
                className={`
            h-full rounded-full 
            transition-all duration-700 ease-out
            ${(balance ?? 0) > 0 ? "bg-green-400/90" : "bg-red-400/90"}
          `}
                style={{
                  width: `${Math.min(((balance ?? 0) / 2000) * 100, 100)}%`,
                }}
              />
            </div>

            <p className="text-white/70 text-xs mt-1">
              {(balance ?? 0) > 0 ? "Healthy balance" : "Balance below zero"}
            </p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-10 flex items-center justify-center gap-6 px-1">
          {/* Add Money */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="backdrop-blur-xl bg-white/20 hover:bg-white/30 
        text-white px-7 py-3 rounded-3xl flex items-center gap-2 
        shadow-xl transition-all active:scale-95"
          >
            <img src="/svg/money-in.svg" className="w-7" />
            <span className="text-lg font-semibold">Add</span>
          </button>

          {/* Withdraw / Pay */}
          {(balance ?? 0) > 0 && userData?.role === "Worker" ? (
            <button
              onClick={() => setIsWithdrawalModalOpen(true)}
              className="backdrop-blur-xl bg-white/20 hover:bg-white/30 
          text-white px-7 py-3 rounded-3xl flex items-center gap-2 
          shadow-xl transition-all active:scale-95"
            >
              <img src="/svg/cash-payment.svg" className="w-7" />
              <span className="text-lg font-semibold">Withdraw</span>
            </button>
          ) : (
            <button
              onClick={() => {
                if ((balance ?? 0) >= 0) return;
                if (!handling) confirmPay();
              }}
              className={`
          px-7 py-3 rounded-3xl flex items-center gap-2 shadow-xl active:scale-95 backdrop-blur-xl
          ${
            (balance ?? 0) >= 0
              ? "bg-white/10 opacity-60 text-white"
              : "bg-green-400 text-white"
          }
        `}
            >
              <img src="/svg/cash-payment.svg" className="w-7" />
              <span className="text-lg font-semibold">Pay</span>
            </button>
          )}
        </div>
      </div>

      {/* TRANSACTIONS SECTION */}
      <div className="mt-10 bg-white rounded-t-3xl p-6 h-full overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Transactions
        </h2>

        <div className="flex gap-3 mb-4">
          {["Recent", "Last Week", "Custom"].map((item) => (
            <button
              key={item}
              className="px-4 py-2 bg-gray-200 rounded-2xl text-gray-700 font-medium hover:bg-gray-300"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Transactions List — You can integrate actual data here */}
        <div className="text-gray-500 text-center mt-20">
          No transactions found
        </div>
      </div>

      {/* Modals */}
      <ManageFundsModal
        isOpen={isAddModalOpen}
        onConfirm={confirmAdd}
        onCancel={onCancel}
        setAmount={setAmount}
        handling={handling}
        action="add"
      />

      <ManageFundsModal
        isOpen={isWithdrawalModalOpen}
        onConfirm={confirmWithdawal}
        onCancel={onCancel}
        setAmount={setAmount}
        handling={handling}
        action="withdraw"
      />
    </div>
  );
};

export default Wallet;
