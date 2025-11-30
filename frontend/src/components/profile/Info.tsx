import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useImageFetcher from "../../utils/Hooks/useImageFetcher";
import { RootState } from "../../app/store";

const Info = () => {
  const userData = useSelector((store: RootState) => store.user.userData);

  const { fetchProfileImage } = useImageFetcher();
  const [profilePicUrl, setProfilePicUrl] = useState<string>();
  const [loadingProfilePic, setLoadingProfilePic] = useState(true);

  useEffect(() => {
    const loadProfilePic = async () => {
      if (!userData?.profilePicUrl) {
        // user has no profile pic → show default avatar
        setProfilePicUrl("/svg/profile.svg");
        setLoadingProfilePic(false);
        return;
      }

      // user has a profile pic → start shimmering
      setLoadingProfilePic(true);

      const url = await fetchProfileImage(userData.profilePicUrl);

      setProfilePicUrl(url || "/svg/profile.svg");
      setLoadingProfilePic(false);
    };

    loadProfilePic();
  }, [userData]);

  return (
    <div className="w-full flex flex-col items-center  rounded-2xl p-4 gap-4">
      {/* Profile Image */}
      <div className="flex flex-col items-center gap-3">
        {loadingProfilePic ? (
          <div className="w-28 h-28 rounded-full bg-gray-200 animate-pulse border-4 border-white shadow-md shimmer" />
        ) : (
          <img
            src={profilePicUrl}
            alt="profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
          />
        )}

        <h2 className="text-2xl inter-semibold mt-1">
          {userData?.name || "User"}
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
