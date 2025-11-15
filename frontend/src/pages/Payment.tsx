import BackButton from "../components/Buttons/BackButton";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useJobBillsFetcher from "../utils/Hooks/useJobBillsFetcher";
import { useExploreContext } from "../utils/context/ExploreContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

declare global {
  interface Window {
    Razorpay: any;
  }
}
interface Charge {
  chargeId: number;
  name: string;
  amount: number;
  jobId: number | string;
}
interface jobBills {
  jobId: number;
  baseAmount: number;
  charges: Charge[];
  paymentMethod: string;
  total: number;
}

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchJobBills, fetching } = useJobBillsFetcher();
  const { fetchMyUploadedJob } = useExploreContext();
  const [jobBills, setJobBills] = useState<jobBills | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [handling, setHandling] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function fetchData() {
      const fetchedJobBills = await fetchJobBills(id as string, paymentMethod);
      setJobBills(fetchedJobBills);
    }
    fetchData();
  }, [id, paymentMethod]);

  async function handleOrder() {
    setHandling(true);
    try {
      const res = await fetch(`${VITE_API_BASE_URL}/api/v1/payments/initiate`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: jobBills?.total,
          jobId: id,
          method: paymentMethod,
        }),
      });
      const data = await res.json();

      if (res.ok && data?.data) {
        const order = data?.data;

        if (order.method === "online") {
          handlePayment(
            Number(order.amount),
            order.razorpay_order_id,
            order.id,
            order.jobId
          );
        } else if (order.method === "wallet") {
          navigate("/wallet-success");
          fetchMyUploadedJob(order.jobId);
        } else if (order.method === "cod") {
          navigate("/cod-success");
          fetchMyUploadedJob(order.jobId);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setHandling(false);
    }
  }

  async function handlePayment(
    amount: number,
    order_id: string,
    paymentId: number,
    jobId: string
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
              `${VITE_API_BASE_URL}/api/v1/payments/verify`,
              {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_payment_id,
                  razorpay_order_id,
                  razorpay_signature,
                  id: paymentId,
                  jobId,
                }),
              }
            );

            const data = await verifyRes.json();

            if (verifyRes.ok) {
              fetchMyUploadedJob(jobId);
              toast.success("Payment verified! Job Posted 🎉");
              navigate("/explore");
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
    } catch (error) {
      console.error(error);
    }
  }

  const [expanded, setExpanded] = useState<string | null>("wallet");

  const toggleAccordion = (method: string) => {
    setExpanded((prev) => (prev === method ? null : method));
    setPaymentMethod(method);
  };

  return (
    <div className="w-full min-h-screen bg-[#ECECEC] flex flex-col gap-10 sm:gap-12 md:gap-14 px-3 sm:px-6 md:px-10 py-4">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <BackButton navigateTo="/profile" />
        <h1 className="text-2xl sm:text-3xl lg:text-4xl poppins-bold">
          Payments
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
        {/* Order Summary */}
        {fetching && jobBills == null ? (
          <div className="shimmer h-40 rounded-xl"></div>
        ) : (
          jobBills && (
            <div className="p-4 sm:p-5 bg-white rounded-2xl flex flex-col gap-4 shadow-sm">
              <p className="inter-medium text-base sm:text-lg border-b border-gray-300 pb-2">
                Order Summary
              </p>
              <div className="space-y-2 text-sm sm:text-base">
                <div className="flex justify-between">
                  <p>Job Price</p>
                  <p>₹{Number(jobBills?.baseAmount / 100).toFixed(2)}</p>
                </div>

                {jobBills?.charges.map((charge) => (
                  <div key={charge.chargeId} className="flex justify-between">
                    <p>{charge?.name}</p>
                    <p>₹{Number(charge?.amount).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 text-base sm:text-lg">
                <p className="inter-medium">Total Amount</p>
                <p>₹{Number(jobBills?.total / 100).toFixed(2)}</p>
              </div>
            </div>
          )
        )}

        {/* Payment Methods */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl flex flex-col gap-3 shadow-sm">
          {/* Wallet Payment Option */}
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleAccordion("wallet")}
          >
            <div className="flex items-center gap-3 sm:gap-5">
              <img src="/svg/wallet.svg" alt="Online" className="w-5 sm:w-6" />
              <p className="text-sm sm:text-base flex items-center gap-1">
                Wallet
                <span className="text-[10px] text-green-600 bg-green-100 px-2 py-0.5 rounded-md">
                  Recommended
                </span>
              </p>
            </div>
            <img
              src="/svg/dropdown-arrow.svg"
              alt=""
              className={`w-5 sm:w-6 transform transition-transform duration-300 ${
                expanded === "wallet" ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>

          {/* Expandable content */}

          <div
            className={`transition-all duration-300 overflow-hidden ${
              expanded === "wallet" ? "max-h-40 mt-4" : "max-h-0"
            }`}
          >
            <div className="flex flex-col justify-center items-center">
              <button
                onClick={handleOrder}
                disabled={handling}
                className="bg-[#0385C2] text-white px-6 py-2 rounded-xl text-sm cursor-pointer"
              >
                Pay Instantly
              </button>
              <span className="text-green-700 text-[10px] mt-2">
                ⚡ Instant payment, exclusive discounts & reward cashback
              </span>
            </div>
          </div>

          <span className="bg-gray-300 h-px w-full" />
          {/* Online Payment Option */}
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleAccordion("online")}
          >
            <div className="flex items-center gap-3 sm:gap-5">
              <img src="/svg/qr-scan.svg" alt="Online" className="w-5 sm:w-6" />
              <p className="text-sm sm:text-base">Online</p>
            </div>
            <img
              src="/svg/dropdown-arrow.svg"
              alt=""
              className={`w-5 sm:w-6 transform transition-transform duration-300 ${
                expanded === "online" ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>

          {/* Expandable content */}

          <div
            className={`transition-all duration-300 overflow-hidden ${
              expanded === "online" ? "max-h-40 mt-4" : "max-h-0"
            }`}
          >
            <div className="flex flex-col justify-center items-center">
              <button
                onClick={handleOrder}
                disabled={handling}
                className="bg-[#565b56] text-white px-6 py-2 rounded-xl text-sm cursor-pointer"
              >
                Proceed to Pay
              </button>
              <span className="text-gray-600 text-[10px] mt-2">
                Pay via UPI, Card, or Netbanking.
              </span>
            </div>
          </div>

          <span className="bg-gray-300 h-px w-full" />

          {/* COD Option */}
          <div
            className="flex items-center justify-between cursor-pointer "
            onClick={() => toggleAccordion("cod")}
          >
            <div className="flex items-center gap-3 sm:gap-5">
              <img
                src="/svg/cash-payment.svg"
                alt="Cash"
                className="w-5 sm:w-6"
              />
              <p className="text-sm sm:text-base">Cash On Delivery</p>
            </div>
            <img
              src="/svg/dropdown-arrow.svg"
              alt=""
              className={`w-5 sm:w-6 transform transition-transform duration-300 ${
                expanded === "cod" ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>

          {/* Expandable content */}
          <div
            className={`transition-all duration-300 overflow-hidden ${
              expanded === "cod" ? "max-h-40 mt-4" : "max-h-0"
            }`}
          >
            <div className="flex flex-col justify-center items-center">
              <button
                onClick={handleOrder}
                disabled={handling}
                className="bg-[#e47b25] text-white px-6 py-2 rounded-xl text-sm  cursor-pointer"
              >
                Confirm COD
              </button>
              <span className="text-red-700 text-[10px] mt-2">
                Avoid paying Extra charges by opting online method.
              </span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-[10px] sm:text-xs text-center leading-relaxed text-gray-600 px-2">
          By continuing, you confirm that you are above 18 years of age, and you
          agree to SnapFix's{" "}
          <span className="text-blue-500 underline">Terms of Use</span> and{" "}
          <span className="text-blue-500 underline">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};

export default Payment;
