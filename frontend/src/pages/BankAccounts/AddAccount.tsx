import { FormEvent, useState } from "react";
import BackButton from "../../components/Buttons/BackButton";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/modals/ConfirmModal";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const NAME_REGEX = /^[A-Za-z ]+$/;
const ACCOUNT_NUMBER_REGEX = /^[0-9]+$/;

const MIN_ACCOUNT_LENGTH = 9;
const MAX_ACCOUNT_LENGTH = 18;

const AddAccount = () => {
  const navigate = useNavigate();
  const token = useSelector((s: RootState) => s.auth.token);

  const [accountHolder, setAccountHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowConfirm(true); // open modal instead of submitting
  };

  const submitAccount = async () => {
    try {
      const holder = accountHolder.trim();
      const bank = bankName.trim();
      const accNo = accountNumber.trim();
      const confirmAccNo = confirmAccountNumber.trim();
      const ifscCode = ifsc.trim().toUpperCase();

      // 1️⃣ Required check
      if (!holder || !bank || !accNo || !confirmAccNo || !ifscCode) {
        toast.error("All fields are required");
        return;
      }

      // 2️⃣ Account holder name validation
      if (holder.length < 2) {
        toast.error("Account holder name is too short");
        return;
      }

      if (!NAME_REGEX.test(holder)) {
        toast.error("Name can only contain letters and spaces");
        return;
      }

      // 3️⃣ Bank name validation
      if (bank.length < 3) {
        toast.error("Bank name is too short");
        return;
      }

      if (!NAME_REGEX.test(bank)) {
        toast.error("Bank name can only contain letters and spaces");
        return;
      }

      // 4️⃣ Account number: digits only
      if (!ACCOUNT_NUMBER_REGEX.test(accNo)) {
        toast.error("Account number must contain only digits");
        return;
      }

      // 5️⃣ Account number length check
      if (
        accNo.length < MIN_ACCOUNT_LENGTH ||
        accNo.length > MAX_ACCOUNT_LENGTH
      ) {
        toast.error(
          `Account number must be between ${MIN_ACCOUNT_LENGTH} and ${MAX_ACCOUNT_LENGTH} digits`
        );
        return;
      }

      // 6️⃣ Account number cannot start with 0
      if (accNo.startsWith("0")) {
        toast.error("Account number cannot start with 0");
        return;
      }

      // 7️⃣ Match confirmation
      if (accNo !== confirmAccNo) {
        toast.error("Account numbers do not match");
        return;
      }

      // 8️⃣ IFSC validation
      if (!IFSC_REGEX.test(ifscCode)) {
        toast.error("Invalid IFSC code");
        return;
      }

      const req = await fetch(
        `${VITE_API_BASE_URL}/api/v1/workers/bank-details`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            accountHolder: holder,
            accountNumber: accNo,
            bankName: bank,
            ifsc: ifscCode,
          }),
        }
      );

      const data = await req.json();
      if (req.ok) {
        toast.success(data.message || "Account added successfully");
        navigate("/profile/bank-accounts");
      } else {
        toast.error(data.message || "Something went wrong Please try again.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-white items-center px-4 sm:px-6 md:px-10 py-6">
      {/* Header */}
      <div className="w-full max-w-3xl flex flex-col gap-2">
        <BackButton navigateTo="/profile/bank-accounts" />
        <h1 className="text-2xl sm:text-3xl poppins-bold">Add Account</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Fill in the details below correctly
        </p>
      </div>

      <form
        className="w-full max-w-3xl flex flex-col items-center gap-3 mt-4"
        onSubmit={handleSubmit}
      >
        <input
          className="bg-[#F4F4F4] rounded-lg text-lg h-12 w-full px-4 border focus:ring transition"
          type="text"
          name="name"
          placeholder="Holder Name"
          value={accountHolder}
          onChange={(e) => setAccountHolder(e.target.value)}
          maxLength={30}
        />
        <input
          className="bg-[#F4F4F4] rounded-lg text-lg h-12 w-full px-4 border focus:ring transition"
          type="text"
          inputMode="numeric"
          name="accountNumber"
          placeholder="Account number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          autoComplete="off"
          maxLength={30}
        />
        <input
          className="bg-[#F4F4F4] rounded-lg text-lg h-12 w-full px-4 border focus:ring transition"
          type="text"
          inputMode="numeric"
          name="confirmAccountNumber"
          placeholder="Confirm Account number"
          value={confirmAccountNumber}
          onChange={(e) => setConfirmAccountNumber(e.target.value)}
          autoComplete="off"
          maxLength={30}
        />
        <input
          className="bg-[#F4F4F4] rounded-lg text-lg h-12 w-full px-4 border focus:ring transition"
          type="text"
          name="bankName"
          placeholder="Bank Name"
          value={bankName}
          onChange={(e) => setBankName(e.target.value.toUpperCase())}
          autoComplete="off"
          maxLength={40}
        />

        <input
          className="bg-[#F4F4F4] rounded-lg text-lg h-12 w-full px-4 border focus:ring transition"
          type="text"
          name="ifsc"
          placeholder="IFSC"
          value={ifsc}
          onChange={(e) => setIfsc(e.target.value.toUpperCase())}
          autoComplete="off"
          maxLength={15}
        />

        {/* Submit button */}
        <button
          type="submit"
          className="w-full mt-6 sm:w-1/2 py-3 px-6 sm:px-10 bg-[#0385c2] rounded-2xl text-xl sm:text-2xl text-white inter-medium cursor-pointer transition-transform active:scale-95"
        >
          Add
        </button>
      </form>
      <ConfirmModal
        isOpen={showConfirm}
        onConfirm={submitAccount}
        onCancel={() => {
          setShowConfirm(false);
        }}
        message="Please confirm that all bank account details are correct."
        confirmButtonName={"Confirm"}
        confirmButtonColor="bg-green-600"
        confirmButtonColorOnHover="bg-green-700"
      />
    </div>
  );
};

export default AddAccount;
