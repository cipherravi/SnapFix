import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useImageFetcher from "../../utils/Hooks/useImageFetcher";

const Info = () => {
  const userData = useSelector((store: any) => store.user.userData);
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
      {/* Profile Image */}
      <div className="flex flex-col items-center gap-3">
        <img
          src={profilePicUrl}
          alt="profile"
          className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
        />
        <h2 className="text-2xl inter-semibold mt-1">
          {userData.name || "User"}
        </h2>
      </div>

      {/* Name + Verified */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-2">
          {userData?.kyc?.status === "verified" && (
            <img src="/svg/verified.svg" alt="verified" className="w-6" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Info;
