import { useEffect, useRef, useState } from "react";
import { Account } from "../../../types";

interface WithdrawBankDropdownProps {
  accounts: Account[];
  selected: Account | null;
  onSelect: (account: Account) => void;
}

const WithdrawBankDropdown = ({
  accounts,
  selected,
  onSelect,
}: WithdrawBankDropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="relative mt-2">
      {/* Selected */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="
          w-full px-4 py-3 rounded-2xl text-left
          bg-white/20 text-white border border-white/20
          hover:bg-white/25 transition-all
        "
      >
        {selected ? (
          <div className="flex justify-between items-center">
            <span>
              {selected.bankName} • ****{" "}
              {String(selected.accountNumber).slice(-4)}
            </span>
            {selected.isPrimary && (
              <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">
                Primary
              </span>
            )}
          </div>
        ) : (
          <span className="text-white/60">Select bank account</span>
        )}
      </button>

      {/* Options */}
      {open && (
        <div
          className="
            absolute z-50 mt-2 w-full rounded-2xl
            bg-black/80 backdrop-blur-xl
            border border-white/20 shadow-xl overflow-hidden
          "
        >
          {accounts.length === 0 && (
            <p className="px-4 py-3 text-white/60 text-sm">
              No bank accounts found
            </p>
          )}

          {accounts.map((acc) => (
            <button
              key={acc.id}
              onClick={() => {
                onSelect(acc);
                setOpen(false);
              }}
              className="
                w-full px-4 py-3 text-left text-white
                hover:bg-white/10 transition-all
                flex justify-between items-center
              "
            >
              <span>
                {acc.bankName} • **** {String(acc.accountNumber).slice(-4)}
              </span>

              {acc.isPrimary && (
                <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">
                  Primary
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default WithdrawBankDropdown;
