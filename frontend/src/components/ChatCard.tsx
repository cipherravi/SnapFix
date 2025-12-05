import { useNavigate } from "react-router-dom";
import { useFetchProfileImageQuery } from "../services/api/assetApi";
import { useEffect, useState } from "react";
type ChatCardProps = {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  profilePic: string;
};

const ChatCard = ({
  id,
  name,
  lastMessage,
  lastMessageTime,
  unreadCount,
  profilePic,
}: ChatCardProps) => {
  const navigate = useNavigate();
  const [profilePicUrl, setProfilePicUrl] = useState<string>();
  const [loadingProfilePic, setLoadingProfilePic] = useState(true);

  const {
    data: profileImageUrlFromApi,
    isLoading: isImageLoading,
    isFetching: isImageFetching,
  } = useFetchProfileImageQuery(profilePic!, {
    skip: !profilePic,
  });

  // ⬇️ Automatically update profile picture when RTK query finishes
  useEffect(() => {
    const loadProfilePic = async () => {
      // Case 1: user has NO profile picture
      if (!profilePic) {
        setProfilePicUrl("/svg/profile.svg");
        setLoadingProfilePic(false);
        return;
      }

      // Case 2: user HAS a profile picture → show shimmer until RTK Query resolves
      setLoadingProfilePic(isImageLoading || isImageFetching);

      if (!isImageLoading && !isImageFetching) {
        setProfilePicUrl(profileImageUrlFromApi);
      }
    };

    loadProfilePic();
  }, [
    id,
    profilePicUrl,
    isImageLoading,
    isImageFetching,
    profileImageUrlFromApi,
  ]);

  return (
    <div
      className="w-full h-18 flex items-center justify-between gap-4 px-3 relative"
      onClick={() => {
        navigate(`/conversation/${id}`);
      }}
    >
      {loadingProfilePic ? (
        <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse shadow-md shimmer" />
      ) : (
        <img
          src={profilePicUrl}
          alt="User Pic"
          className={`w-12 h-12 rounded-full object-cover ${
            profilePic ? "" : "outline-1 p-1"
          }`}
        />
      )}
      <div className=" w-full h-full border-b border-b-gray-300  flex-1 ">
        <p className="pt-3 text-xl inter-semibold">{name}</p>
        <p className="">{lastMessage}</p>
      </div>
      <div className="absolute right-3 flex flex-col items-center">
        <p className="inter-light">
          {unreadCount > 0 ? (
            <strong className="inter-light text-[#0385C2]">
              {lastMessageTime}
            </strong>
          ) : (
            lastMessageTime
          )}
        </p>
        {unreadCount > 0 ? (
          <p className="bg-[#0385C2] rounded-full w-5 h-5 flex justify-center items-center text-white">
            {unreadCount}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default ChatCard;
