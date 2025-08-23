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
  bgColor = "#DADADA",
  rotateDegree = "0deg",
}: BackButtonProps) => {
  const navigate = useNavigate();
  return (
    <button
      style={{
        backgroundColor: bgColor,
        rotate: rotateDegree,
      }}
      className={`w-12 h-12 rounded-full flex items-center justify-center `}
      onClick={() => navigate(navigateTo)}
    >
      <img
        src={imgUrl}
        alt="Back"
        className={` ${rotateDegree === "90deg" ? "h-10 invert" : "h-8"}  `}
      />
    </button>
  );
};

export default BackButton;
