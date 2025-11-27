import { useNavigate } from "react-router-dom";

const isIOS =
  typeof window !== "undefined" &&
  /iPhone|iPad|iPod/i.test(window.navigator.userAgent);

const Tabs = () => {
  const navigate = useNavigate();

  return (
    <div
      className={`w-full h-14  bottom-0 flex justify-center fixed z-9999 ${
        isIOS ? "pb-[env(safe-area-inset-bottom)] mb-2" : ""
      }
`}
    >
      <div className="w-[95%] h-full rounded-full bg-[#F4F4F4] flex justify-around items-center">
        <img
          src="/svg/home.svg"
          alt="Home"
          className="h-10"
          onClick={() => navigate("/explore")}
        />
        <img
          src="/svg/search.svg"
          alt="Search"
          className="h-9"
          onClick={() => navigate("/search")}
        />
        <img
          src="/svg/create.svg"
          alt="Create "
          className="h-9"
          onClick={() => navigate("/create")}
        />
        <img
          src="/svg/profile.svg"
          alt="Profile"
          className="h-7"
          onClick={() => navigate("/profile")}
        />
      </div>
    </div>
  );
};

export default Tabs;
