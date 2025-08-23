import { useUserInfo } from "../../utils/context/UserInfoContext";

const Info = () => {
  const { userData } = useUserInfo();
  return (
    <div className="w-full min-h-1/4 flex bg-[#545454] rounded-2xl p-2 pb-5">
      <div className="w-[25%] flex items-start pt-2 justify-center  ">
        <img
          src="/svg/profile.svg"
          alt="Profile Pic"
          className="w-14  p-2 rounded-full border border-white bg-red-300"
        />
      </div>
      <div className="w-[75%]  flex flex-col justify-center gap-3">
        <div className=" flex gap-3 pl-2">
          <h1 className="text-white text-2xl inter-medium">{userData?.name}</h1>
          <img src="/svg/verified.svg" alt="verified icon" className="w-7" />
        </div>
        <div className="flex gap-2 items-center ">
          <img src="/svg/money-in.svg" alt="wallet icon" className="w-8 " />
          <p className="inter-regular text-white">Balance :</p>
          <p className="inter-medium text-white">₹ {1200}</p>

          <button className="h-8 w-18 rounded-md bg-[#0385C2] inter-medium text-white">
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default Info;
