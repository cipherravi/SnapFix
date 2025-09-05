import BackButton from "../../components/Buttons/BackButton";
import { Link } from "react-router-dom";
const Main = () => {
  return (
    <div>
      {/* Header */}
      <div className="shrink-0 pt-4 px-4 flex flex-col gap-4">
        <BackButton navigateTo="/profile" />
        <h1 className="text-3xl poppins-bold">Admin Panel</h1>
      </div>
      {/* Categories */}
      <div className="flex flex-col items-center mt-10 ">
        <Link to={"dashboard"}>
          <button className="px-7 py-2 bg-amber-200 inter-semibold rounded-xl">
            Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Main;
