import { Label } from "@/shared/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select.tsx";

interface EnumSelectFieldProps<T extends string> {
  label: string;
  value: T;
  options: readonly T[];
  getLabel: (option: T) => string;
  onChange: (value: T) => void;
}

export const EnumSelectField = <T extends string>({
  label,
  value,
  options,
  getLabel,
  onChange,
}: EnumSelectFieldProps<T>) => (
  <div className="flex flex-col gap-1">
    <Label>{label}</Label>
    <Select
      value={value}
      onValueChange={(val) => {
        const next = options.find((option) => option === val);
        if (next) onChange(next);
      }}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {getLabel(option)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);
