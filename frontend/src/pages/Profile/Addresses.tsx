import { Outlet } from "react-router-dom";

const Addresses = () => {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-white">
      <Outlet />
    </div>
  );
};

export default Addresses;
