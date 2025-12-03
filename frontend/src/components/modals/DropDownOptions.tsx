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

const isAddressOption = (option: any): option is Address => {
  return (
    option &&
    "building" in option &&
    "area" in option &&
    typeof option.area === "object"
  );
};

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
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleSelect = (option: T) => {
    if (disabled) return;
    setSelected(option);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
      if (!isOpen && options.length > 0) setHighlightedIndex(0);
    }
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement | HTMLUListElement>
  ) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex(
        (prev) => (prev - 1 + options.length) % options.length
      );
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(options[highlightedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={`w-full relative ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } focus-within:ring-2 focus-within:ring-[#0385C2] focus-within:ring-offset-0 rounded-lg`}
    >
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        className={`w-full h-12 px-4 flex items-center justify-between bg-[#F4F4F4] rounded-lg border border-black ${
          disabled ? "cursor-not-allowed" : ""
        } focus:outline-none`}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate">
          {selected
            ? variant === "address" && isAddressOption(selected)
              ? getFullAddress(selected)
              : isBaseOption(selected)
              ? selected.name
              : ""
            : placeholder}
        </span>
        <img
          src="/svg/dropdown.svg"
          alt="Dropdown icon"
          className={`w-5 h-5 ${
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          }`}
        />
      </button>

      {isOpen && !disabled && (
        <ul
          className="absolute top-0 mt-12 w-full max-h-[50vh] overflow-y-auto bg-[#F4F4F4] border border-t-0 border-black rounded-b-lg shadow z-10 focus:outline-none"
          role="listbox"
          tabIndex={-1}
          onKeyDown={handleKeyDown}
        >
          {options.map((option, idx) => {
            const displayValue =
              variant === "address" && isAddressOption(option)
                ? getFullAddress(option)
                : isBaseOption(option)
                ? option.name
                : "";

            const isSelected = selected?.id === option.id;
            const isHighlighted = highlightedIndex === idx;

            return (
              <li
                key={option.id}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option)}
                onMouseEnter={() => setHighlightedIndex(idx)}
                className={`px-4 py-3 cursor-pointer ${
                  isHighlighted ? "bg-blue-100" : ""
                } ${isSelected ? "font-semibold" : ""}`}
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
