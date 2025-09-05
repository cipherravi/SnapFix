import { Outlet } from "react-router-dom";
const Admin = () => {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-white">
      <Outlet />
    </div>
  );
};

export default Admin;
