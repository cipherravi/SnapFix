import { useUserInfo } from "../../utils/context/UserInfoContext";
import { useNavigate } from "react-router-dom";

const Primary = () => {
  const navigate = useNavigate();
  const { userData } = useUserInfo();

  return (
    <div className="w-full  flex flex-col items-center ">
      <div className="w-full h-full bg-[#545454] rounded-2xl relative py-2 pl-7">
        {/* wallet */}

        <div className="w-full flex items-center gap-5">
          <img
            src="/svg/wallet.svg"
            alt="wallet icon"
            className="w-7 filter invert"
          />
          <div className="w-full border-b border-white/30 py-2 flex justify-between items-center">
            <p className="text-white text-sm inter-regular">Wallet</p>

            <img
              src="/svg/dropdown-arrow.svg"
              alt="Arrow icon"
              className="w-8 filter invert pr-2 rotate-270"
            />
          </div>
        </div>

        {/* Jobs */}

        <div className="w-full flex items-center gap-5">
          <img
            src="/svg/work-list.svg"
            alt="wallet icon"
            className="w-8 filter invert"
          />
          <div
            className="w-full border-b border-white/30 py-2 flex justify-between items-center"
            onClick={() => navigate("jobs")}
          >
            <p className="text-white text-sm inter-regular">Posted Jobs</p>
            <img
              src="/svg/dropdown-arrow.svg"
              alt="Arrow icon"
              className="w-8 filter invert pr-2 rotate-270"
            />
          </div>
        </div>

        {/* Tasks */}
        {userData?.role !== "Worker" ? null : (
          <div className="w-full flex items-center gap-5">
            <img
              src="/svg/work-list.svg"
              alt="wallet icon"
              className="w-8 filter invert"
            />
            <div
              className="w-full border-b border-white/30 py-2 flex justify-between items-center"
              onClick={() => navigate("tasks")}
            >
              <p className="text-white text-sm inter-regular">Assigned Tasks</p>
              <img
                src="/svg/dropdown-arrow.svg"
                alt="Arrow icon"
                className="w-8 filter invert pr-2 rotate-270"
              />
            </div>
          </div>
        )}

        {/*  Transactions */}

        <div className="w-full flex items-center gap-5">
          <img
            src="/svg/transactions.svg"
            alt="wallet icon"
            className="w-7 filter invert"
          />
          <div className="w-full py-2 flex justify-between items-center">
            <p className="text-white text-sm inter-regular">Transactions</p>

            <img
              src="/svg/dropdown-arrow.svg"
              alt="Arrow icon"
              className="w-8 filter invert pr-2 rotate-270"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Primary;
