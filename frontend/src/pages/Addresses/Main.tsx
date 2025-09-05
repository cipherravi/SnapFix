import { useEffect, useState } from "react";
import BackButton from "../../components/Buttons/BackButton";
import useAddressFetcher from "../../utils/Hooks/useAddressFetcher";
import { useNavigate } from "react-router-dom";

interface Address {
  id: number;
  building: string;
  street: string;
  area: string;
  city: string;
  district: string;
  state: string;
  createdAt: string;
}

const Main = () => {
  const navigate = useNavigate();
  const { fetchAddresses } = useAddressFetcher();
  const [addresses, setAddresses] = useState<Address[] | []>([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedAddresses = await fetchAddresses();
      setAddresses(fetchedAddresses);
    };
    fetchData();
  }, []);

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
              <div className="text-gray-800 flex-1">
                <p className="inter-semibold text-base">{address.building}</p>
                <p className="inter-regular text-sm text-gray-600">
                  {address.street && `${address.street}, `}
                  {address.area}, {address.city}, {address.district},{" "}
                  {address.state}
                </p>
              </div>
              <button
                className="absolute top-0 right-0 bg-[#dfdfdf] p-1 rounded-full"
                onClick={() => navigate(`edit/${address.id}`)}
              >
                <img src="/svg/edit.svg" alt="" className="w-7 p-1" />
              </button>
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
    </>
  );
};

export default Main;
