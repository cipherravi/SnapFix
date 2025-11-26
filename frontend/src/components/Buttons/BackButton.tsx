import { useNavigate } from "react-router-dom";

type BackButtonProps = {
  navigateTo: string;
  imgUrl?: string;
  bgColor?: string;
  rotateDegree?: string;
};

const BackButton = ({
  navigateTo,
  imgUrl = "/svg/arrow-left.svg",
  bgColor = "rgba(0,0,0,0.05)",
  rotateDegree = "0deg",
}: BackButtonProps) => {
  const navigate = useNavigate();
  return (
    <button
      style={{
        backgroundColor: bgColor,
        rotate: rotateDegree,
      }}
      className={`
        w-10 h-10 rounded-full flex items-center justify-center
        hover:bg-gray-200 transition-colors
        shadow-sm
        `}
      onClick={() => navigate(navigateTo)}
    >
      <img src={imgUrl} alt="Back" />
    </button>
  );
};

export default BackButton;
