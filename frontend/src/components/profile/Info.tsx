import { useEffect, useState } from "react";
import { useUserInfo } from "../../utils/context/UserInfoContext";
import useImageFetcher from "../../utils/Hooks/useImageFetcher";

const Info = () => {
  const { userData } = useUserInfo();
  const { fetchPublicImage } = useImageFetcher();
  const [profilePicUrl, setProfilePicUrl] = useState("/svg/profile.svg");

  useEffect(() => {
    const fetchData = async () => {
      if (userData?.profilePicUrl) {
        const url = await fetchPublicImage(
          userData?.profilePicUrl ?? "user.svg"
        );
        setProfilePicUrl(url);
      }
    };
    fetchData();
  }, [userData]);

  return (
    <div className="w-full flex flex-col items-center  rounded-2xl p-4 gap-4">
      {/* Profile Pic */}
      <div className="flex justify-center">
        <img
          src={profilePicUrl}
          alt="Profile Pic"
          className="w-24 h-24 rounded-full object-cover border p-2"
        />
      </div>

      {/* Name + Verified */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl inter-medium">{userData?.name}</h1>
          {userData?.kyc?.status === "verified" && (
            <img src="/svg/verified.svg" alt="verified" className="w-6" />
          )}
        </div>

        {/* Optional Wallet Section */}

        {/* <div className="flex gap-2 items-center flex-wrap justify-center">
          <img src="/svg/money-in.svg" alt="wallet" className="w-6" />
          <p className="inter-regular">Balance:</p>
          <p className="inter-medium text-nowrap">₹ {1200}</p>
          <button className="ml-2 px-3 py-1 bg-[#0385C2] text-sm rounded-md text-white">
            Add
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Info;
