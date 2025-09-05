import { useNavigate } from "react-router-dom";
import { useUserInfo } from "../../utils/context/UserInfoContext";

const Secondary = () => {
  const navigate = useNavigate();
  const { userData } = useUserInfo();

  return (
    <div className="w-full  flex flex-col items-center ">
      <div className="w-full h-full bg-[#545454] rounded-2xl relative py-2 pl-7">
        {/* Address */}
        <div
          className="w-full flex items-center gap-5"
          onClick={() => navigate("addresses")}
        >
          <img
            src="/svg/location.svg"
            alt="wallet icon"
            className="w-7 filter invert"
          />
          <div className="w-full border-b border-white/30 py-2 flex justify-between items-center">
            <p className="text-white text-sm inter-regular">Addresses</p>
            <img
              src="/svg/dropdown-arrow.svg"
              alt="Arrow icon"
              className="w-8 filter invert pr-2 rotate-270"
            />
          </div>
        </div>
        {/* Account*/}
        <div
          className="w-full flex items-center gap-5"
          onClick={() => navigate("account")}
        >
          <img
            src="/svg/user.svg"
            alt="wallet icon"
            className="w-7 filter invert"
          />
          <div className="w-full border-b border-white/30 py-2 flex justify-between items-center">
            <p className="text-white text-sm inter-regular">Account</p>
            <img
              src="/svg/dropdown-arrow.svg"
              alt="Arrow icon"
              className="w-8 filter invert pr-2 rotate-270"
            />
          </div>
        </div>
        {/*  KYC */}
        <div className="w-full flex items-center gap-5">
          <img
            src="/svg/fingerprint.svg"
            alt="wallet icon"
            className="w-7 filter invert"
          />
          <div
            className="w-full py-2 flex justify-between items-center border-b border-white/30"
            onClick={() => navigate("kyc")}
          >
            <p className="text-white text-sm inter-regular">KYC</p>

            <img
              src="/svg/dropdown-arrow.svg"
              alt="Arrow icon"
              className="w-8 filter invert pr-2 rotate-270"
            />
          </div>
        </div>

        {/* Admin page */}
        {userData?.role !== "Admin" ? null : (
          <div className="w-full flex items-center gap-5">
            <img
              src="/svg/admin.svg"
              alt="wallet icon"
              className="w-7 filter invert"
            />
            <div
              className="w-full border-b border-white/30 py-2 flex justify-between items-center"
              onClick={() => navigate("/admin")}
            >
              <p className="text-white text-sm inter-regular">Admin Panel</p>
              <img
                src="/svg/dropdown-arrow.svg"
                alt="Arrow icon"
                className="w-8 filter invert pr-2 rotate-270"
              />
            </div>
          </div>
        )}

        {/* Help & Support */}
        <div className="w-full flex items-center gap-5">
          <img
            src="/svg/support.svg"
            alt="wallet icon"
            className="w-7 filter invert"
          />
          <div className="w-full py-2 flex justify-between items-center">
            <p className="text-white text-sm inter-regular">Help & Support</p>

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

export default Secondary;
