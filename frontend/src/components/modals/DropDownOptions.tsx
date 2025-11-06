import { useEffect, useRef, useState } from "react";
import type { Address } from "../../../types";
interface BaseOption {
  id: number;
  name: string;
}
type DropDownOptionType = BaseOption | Address;

interface DropDownOptionsProps<T extends DropDownOptionType> {
  selected: T | null;
  setSelected: (option: T) => void;
  options: T[];
  variant: "name" | "address";
  placeholder: string;
  disabled?: boolean;
}

const isBaseOption = (option: any): option is BaseOption => {
  return option && typeof option.name === "string";
};

// 🧠 Type guard to check if it's an Address
const isAddressOption = (option: any): option is Address => {
  return (
    option &&
    "building" in option &&
    "area" in option &&
    typeof option.area === "object"
  );
};

// 🧠 Build full address string from nested Address
const getFullAddress = (address: Address) => {
  return [
    address.building,
    address.street,
    address.area?.name,
    address.area?.city?.name,
    address.area?.city?.pincode,
    address.area?.city?.district?.name,
    address.area?.city?.district?.state?.name,
  ]
    .filter(Boolean)
    .join(", ");
};

const DropDownOptions = <T extends DropDownOptionType>({
  selected,
  setSelected,
  options,
  variant,
  placeholder,
  disabled = false,
}: DropDownOptionsProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: T) => {
    if (disabled) return;
    setSelected(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={`w-full  relative ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <div className="flex border bg-[#F4F4F4] h-12 shadow rounded-lg px-4 items-center">
        <button
          onClick={toggleDropdown}
          className="w-full py-3 text-start focus:outline-none bg-transparent truncate"
          disabled={disabled}
        >
          {selected
            ? variant === "address" && isAddressOption(selected)
              ? getFullAddress(selected)
              : isBaseOption(selected)
              ? selected.name
              : ""
            : placeholder}
        </button>
        <img
          src="/svg/dropdown.svg"
          alt="Dropdown icon"
          className={`w-6 ml-2 ${
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={toggleDropdown}
        />
      </div>

      {isOpen && !disabled && (
        <ul className="absolute top-full  w-full max-h-[50vh] overflow-scroll bg-[#F4F4F4] border rounded shadow mt-1 z-10">
          {options.map((option) => {
            const displayValue =
              variant === "address" && isAddressOption(option)
                ? getFullAddress(option)
                : isBaseOption(option)
                ? option.name
                : "";

            return (
              <li
                key={option.id}
                onClick={() => handleSelect(option)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer "
              >
                {displayValue}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default DropDownOptions;
