import { useNavigate } from "react-router-dom";

const isIOSPWA = () => {
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    // fallback for older iOS
    (window.navigator as any).standalone === true;
  return isIOS && isStandalone;
};

const Tabs = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-center z-50">
      <div
        className={`
          w-[95%] h-14 rounded-full
          bg-white/20 backdrop-blur-xl
          border border-white/30
          shadow-[0_20px_40px_-10px_rgba(0,0,0,0.25)]
          flex justify-around items-center
          ${isIOSPWA() ? "mb-[env(safe-area-inset-bottom)]" : ""}
        `}
      >
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
          alt="Create"
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
