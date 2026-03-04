"use client";

import { Select } from "@/components/ui/select";

const INDONESIAN_BANKS = [
  "BCA",
  "Mandiri",
  "BNI",
  "BRI",
  "CIMB Niaga",
  "Danamon",
  "Permata",
  "BTN",
  "Maybank",
  "OCBC NISP",
  "Panin",
  "BTPN",
  "Jenius",
  "Bank Jago",
  "Seabank",
  "Blu",
  "Neobank",
  "Allo Bank",
  "Bank Raya",
  "Bank Mega",
];

interface BankSelectorProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
}

export function BankSelector({ value, onChange, id }: BankSelectorProps) {
  return (
    <Select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Pilih Bank</option>
      {INDONESIAN_BANKS.map((bank) => (
        <option key={bank} value={bank}>
          {bank}
        </option>
      ))}
    </Select>
  );
}
