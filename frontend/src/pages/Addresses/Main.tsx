import BackButton from "../../components/Buttons/BackButton";
import { useAddressContext } from "../../utils/context/AddressContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import ConfirmModal from "../../components/modals/ConfirmModal";
import { useState } from "react";

const Main = () => {
  const navigate = useNavigate();
  const { addresses, setAddresses } = useAddressContext();

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;
    try {
      const response = await fetch(
        `${VITE_API_BASE_URL}/api/v1/addresses/${selectedId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || "Address removed successfully");
        const remainingAddresses = addresses.filter(
          (address) => address.id !== selectedId
        );
        setAddresses(remainingAddresses);
      } else {
        toast.error(data.message || "Failed to remove address");
      }
    } catch (error) {
      toast.error("Something went wrong while removing address");
    } finally {
      setShowConfirm(false);
      setSelectedId(null);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="shrink-0 pt-4 px-4 flex flex-col gap-4">
        <BackButton navigateTo="/profile" />
        <h1 className="text-3xl poppins-bold">Addresses</h1>
      </div>

      {/* Address List */}
      <div className="flex flex-col gap-4 px-4 py-6 overflow-y-auto">
        {addresses.length > 0 ? (
          addresses.map((address) => (
            <div
              key={address.id}
              className="w-full rounded-xl bg-[#f9f9f9] shadow-md border border-gray-200 p-4 flex items-start gap-4 hover:shadow-lg transition-shadow duration-200 relative"
            >
              <div className="text-[#0385C2] mt-1">
                <img src="/svg/location.svg" alt="" className="w-10" />
              </div>
              <div className="text-gray-800 flex-1 flex flex-col gap-1">
                <p className="inter-semibold text-base">{address.building}</p>
                <p className="inter-regular text-sm text-gray-600">
                  {address.street}, {address.area.name},{" "}
                  {address.area.city.name}, {address.area.city.pincode},{" "}
                  {address.area.city.district.name},{" "}
                  {address.area.city.district.state.name}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  className=" bg-[#dfdfdf] p-1 rounded-full"
                  onClick={() => navigate(`edit/${address.id}`)}
                >
                  <img src="/svg/edit.svg" alt="" className="w-7 p-1" />
                </button>
                <button
                  className=" bg-[#ffbdbd] p-1 rounded-full"
                  onClick={() => handleDeleteClick(address.id)}
                >
                  <img src="/svg/delete.svg" alt="" className="w-7 p-1" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-8">No addresses found</p>
        )}

        <div className="w-full flex justify-center mt-10">
          <button
            className="bg-[#0385c2] p-2 rounded-lg text-white inter-regular cursor-pointer"
            onClick={() => navigate("create")}
          >
            Create Address
          </button>
        </div>
      </div>
      <ConfirmModal
        isOpen={showConfirm}
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowConfirm(false);
          setSelectedId(null);
        }}
        message="Are you sure you want to delete this address?"
      />
    </>
  );
};

export default Main;
