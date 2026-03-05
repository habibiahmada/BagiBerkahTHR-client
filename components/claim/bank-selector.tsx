"use client";

import { Select } from "@/components/ui/select";

const INDONESIAN_BANKS = [
  // Major Banks (Xendit Supported)
  "BCA",
  "Mandiri",
  "BNI",
  "BRI",
  "CIMB Niaga",
  "Permata",
  "Danamon",
  "BTN",
  "BSI",
  "Maybank",
  "OCBC NISP",
  "Panin",
  "BTPN",
  "Jenius",
  "Mega",
  "Sinarmas",
  // Digital Banks
  "BCA Digital",
  "Seabank",
  "Jago",
  "Allo Bank",
  "BNC",
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
