import { useNavigate } from "react-router-dom";

type ChatCardProps = {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  markAsRead: (id: string) => void;
};

const ChatCard = ({
  id,
  name,
  lastMessage,
  lastMessageTime,
  unreadCount,
  markAsRead,
}: ChatCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="w-full h-18 flex items-center justify-between gap-4 px-3 relative"
      onClick={() => {
        navigate(`/conversation/${id}`), markAsRead(id);
      }}
    >
      <img
        src="/svg/profile.svg"
        alt="User Pic"
        className="w-10 rounded-full outline-1 p-1"
      />
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
