import Logout from "../../components/auth/Logout";
import Info from "../../components/profile/Info";
import Primary from "../../components/profile/Primary";
import Secondary from "../../components/profile/Secondary";

const Main = () => {
  return (
    <div className="w-full min-h-screen bg-white pt-4 pb-24 sm:pb-32">
      <div className=" mt-10 sm:gap-10 px-4 sm:px-6 md:px-10">
        <div className="flex flex-col gap-6 items-center w-full max-w-2xl mx-auto">
          <Info />
          <Primary />
          <Secondary />
          <Logout />
        </div>
      </div>
    </div>
  );
};

export default Main;
