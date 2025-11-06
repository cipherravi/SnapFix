import BackButton from "../../components/Buttons/BackButton";
import ManageFundsModal from "../../components/modals/ManageFundsModal";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useWalletFetcher from "../../utils/Hooks/useWalletFetcher";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Wallet = () => {
  const { data, error, loading, refetch } = useWalletFetcher();

  const [balance, setBalance] = useState<number>(0);
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
    if (error) {
      toast.error("Failed to load wallet balance. Please try again!");
    }
  }, [error]);

  const confirmAdd = async () => {
    setHandling(true);
    try {
      if (amount < 100) {
        toast.error("Minimum ₹100 allowed");
        return;
      }

      const res = await fetch(`${VITE_API_BASE_URL}/api/v1/wallet/add-money`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          purpose: "add_balance",
        }),
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
    } catch (error) {
      console.error(error);
    } finally {
      setHandling(false);
      setAmount(0);
      setIsAddModalOpen(false);
    }
  };

  async function confirmWithdawal() {
    setHandling(true);
    try {
      if (amount <= 0 || amount > balance) {
        toast.error("Enter Valid amount");
        return;
      }
      if (amount < 200) {
        toast.error("Minimum ₹200 withdrawal allowed");
        return;
      }

      const res = await fetch(
        `${VITE_API_BASE_URL}/api/v1/wallet/withdraw-money`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount,
            purpose: "withdrawal",
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        await refetch();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setHandling(false);
      setAmount(0);
      setIsWithdrawalModalOpen(false);
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
        prefill: {
          name: "Ravi Kumar",
          email: "ravi.kumar@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#F37254",
        },
        handler: async function (response: any) {
          // ✅ Razorpay gives you these fields
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
            response;

          // Now call your backend to verify payment
          try {
            const verifyRes = await fetch(
              `${VITE_API_BASE_URL}/api/v1/wallet/verify`,
              {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_payment_id,
                  razorpay_order_id,
                  razorpay_signature,
                  id,
                  walletId,
                  amount,
                }),
              }
            );

            const data = await verifyRes.json();

            if (verifyRes.ok) {
              // ✅ Refresh wallet data after success
              await refetch();
              toast.success("Amount added successfully 🎉");
            } else {
              toast.error(data?.message || "Payment verification failed!");
            }
          } catch (err) {
            console.error(err);
            toast.error("Something went wrong while verifying payment");
          }
        },
        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled");
          },
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {}
  }

  const onCancel = async () => {
    setIsAddModalOpen(false);
    setIsWithdrawalModalOpen(false);
    setAmount(0);
  };

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden bg-[#F2F2F2] relative">
      <div className="shrink-0 pt-4 px-3 flex flex-col gap-4 absolute z-100">
        <BackButton navigateTo="/profile" />
      </div>
      <div className="w-full h-2/5 bg-[#0385C2] rounded-b-4xl ">
        <div className="pt-30 pl-6 ">
          <p className="text-white text-xl inter-semibold">Total Balance</p>
          <p className="text-white text-5xl mt-2 inter-bold">
            ₹{" "}
            <span
              className={`text-green-400 ${
                balance > 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {Number(balance || 0).toFixed(2)}
            </span>
          </p>
        </div>

        <div className="w-full flex justify-around mt-10">
          <div
            className="bg-white px-7 py-2 rounded-3xl flex gap-2"
            onClick={() => {
              setIsAddModalOpen(true);
            }}
          >
            <img src="/svg/money-in.svg" alt="" className="w-8" />
            <button className=" text-xl inter-semibold">Add</button>
          </div>

          {balance > 0 ? (
            <div
              className="bg-white px-7 py-2 rounded-3xl flex gap-2"
              onClick={() => setIsWithdrawalModalOpen(true)}
            >
              <img src="/svg/cash-payment.svg" alt="" className="w-8" />
              <button className=" text-xl inter-semibold">Withdraw</button>
            </div>
          ) : (
            <div
              className="bg-green-400 px-7 py-2 rounded-3xl flex gap-2"
              onClick={() => console.log("paying debt amount")}
            >
              <img src="/svg/cash-payment.svg" alt="" className="w-8" />
              <button className=" text-xl inter-semibold">Pay</button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-7 ml-4">
        <h1 className="inter-semibold text-2xl">Transactions</h1>
        <div className="w-full mt-3 flex gap-3">
          <button className="text-lg inter-medium px-4 bg-gray-300 rounded-2xl">
            Recent
          </button>
          <button className="text-lg inter-medium px-4 bg-gray-300 rounded-2xl">
            Last Week
          </button>
          <button className="text-lg inter-medium px-4 bg-gray-300 rounded-2xl">
            Custom
          </button>
        </div>

        <div></div>
      </div>

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
