import Logout from "../../components/auth/Logout";
import Info from "../../components/profile/Info";
import Primary from "../../components/profile/Primary";
import Secondary from "../../components/profile/Secondary";

const Main = () => {
  return (
    <div className="w-full min-h-full  bg-white pt-4 pb-20">
      <div className="h-full flex flex-col gap-10 mx-4">
        {/* Heading */}
        <h1 className="text-3xl  poppins-semibold ">Profile</h1>

        {/* Cards */}
        <div className="w-full max-h-[70%] flex flex-col gap-4 items-center">
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
