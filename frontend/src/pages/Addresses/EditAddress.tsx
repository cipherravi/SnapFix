import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAddressFetcher from "../../utils/Hooks/useAddressFetcher";
import BackButton from "../../components/Buttons/BackButton";
import toast from "react-hot-toast";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

const EditAddress = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchAddress } = useAddressFetcher();
  const [address, setAddress] = useState<Address | null>(null);

  const [building, setBuilding] = useState("");
  const [street, setStreet] = useState("");
  const [area, setArea] = useState("");

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        const fetchedAddress = await fetchAddress(id);
        setAddress(fetchedAddress);
        setBuilding(fetchedAddress?.building || "");
        setStreet(fetchedAddress?.street || "");
        setArea(fetchedAddress?.area || "");
      };
      fetchData();
    }
  }, [id]);

  console.log(address);

  const inputProps = {
    className:
      "bg-[#F4F4F4] rounded-xl text-xl h-14 w-full pl-4 pr-4 border focus:ring",
    maxLength: 30,
  };

  const validateInput = (value: any) => {
    // Not only numbers or whitespace, and min 3 non-whitespace characters
    const cleaned = value.trim();
    return cleaned.length >= 3 && /\D/.test(cleaned); // Must contain at least one non-digit
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (![building, street, area].every(validateInput)) {
        toast.error("Please fill in all fields correctly.");
        return;
      }
      console.log(building, street, area);
      const response = await fetch(`${VITE_API_BASE_URL}/api/v1/addresses`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id,
          building,
          street,
          area,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Address Updated Successfully!");
        navigate("/profile/addresses");
      } else {
        toast.error(data.message || "Address update Failed!");
      }
    } catch (err) {
      toast.error("An error occurred while Address Update.");
    }
  };
  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <div className="shrink-0 pt-4 px-4 flex flex-col gap-4">
        <BackButton navigateTo="/profile/addresses" />
        <h1 className="text-3xl poppins-bold">Edit Address</h1>

        {/* Edit Section */}

        <form
          onSubmit={handleSubmit}
          className="w-full py-4 flex flex-col gap-3"
        >
          <input
            {...inputProps}
            type="text"
            name="building"
            placeholder="Building Name"
            value={building}
            onChange={(e) => setBuilding(e.target.value)}
            required
            autoComplete="off"
            title="Must include letters and be at least 3 characters long"
          />

          <input
            {...inputProps}
            type="text"
            name="street"
            placeholder="Street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            required
            autoComplete="off"
            title="Must include letters and be at least 3 characters long"
          />

          <input
            {...inputProps}
            type="text"
            name="area"
            placeholder="Area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            required
            autoComplete="off"
            title="Must include letters and be at least 3 characters long"
          />

          <input
            {...inputProps}
            type="text"
            name="city"
            placeholder="City"
            value="Arrah"
            readOnly
          />

          <input
            {...inputProps}
            type="text"
            name="district"
            placeholder="District"
            value="Bhojpur"
            readOnly
          />

          <input
            {...inputProps}
            type="text"
            name="state"
            placeholder="State"
            value="Bihar"
            readOnly
          />

          <div className="w-full flex justify-center ">
            <button
              type="submit"
              className="py-2 px-5 bg-[#0385c2] rounded-2xl text-2xl text-white inter-medium cursor-pointer absolute bottom-10"
            >
              Confirm Edit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAddress;
