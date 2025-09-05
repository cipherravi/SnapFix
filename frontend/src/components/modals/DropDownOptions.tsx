import { useEffect, useRef, useState } from "react";

interface BaseOption {
  id: number;
  name: string;
}

interface AddressOption extends BaseOption {
  building: string;
  street: string;
  area: string;
  city: string;
  district: string;
  state: string;
}
type DropDownOptionType = BaseOption | AddressOption;

interface DropDownOptionsProps<T extends DropDownOptionType> {
  selected: T | null;
  setSelected: (option: T) => void;
  options: T[];
  variant: "name" | "address";
  placeholder: string;
  disabled?: boolean;
}

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

  function isAddressOption(
    option: DropDownOptionType
  ): option is AddressOption {
    return (
      "building" in option &&
      "street" in option &&
      "area" in option &&
      "city" in option &&
      "district" in option &&
      "state" in option
    );
  }

  return (
    <div
      ref={dropdownRef}
      className={`w-full  px-4 relative ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <div className="flex border bg-[#F4F4F4] shadow rounded-lg px-4 items-center">
        <button
          onClick={toggleDropdown}
          className="w-full py-3 text-start focus:outline-none bg-transparent"
          disabled={disabled}
        >
          {selected
            ? variant === "address" && isAddressOption(selected)
              ? `${selected.building}, ${selected.street}, ${selected.area}, ${selected.city}, ${selected.district}, ${selected.state}`
              : selected.name
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
        <ul className="absolute top-full left-4 w-11/12 max-h-[50vh] overflow-scroll bg-[#F4F4F4] border rounded shadow mt-1 z-10">
          {options.map((option) => {
            const displayValue =
              variant === "address" && isAddressOption(option)
                ? `${option.building}, ${option.street}, ${option.area}, ${option.city}, ${option.district}, ${option.state}`
                : option.name;

            return (
              <li
                key={option.id}
                onClick={() => handleSelect(option)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
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
