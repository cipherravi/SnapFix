import { Outlet } from "react-router-dom";

const BankAccounts = () => {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-white">
      <Outlet />
    </div>
  );
};

export default BankAccounts;
