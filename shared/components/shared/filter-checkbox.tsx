import React from 'react';
import { Checkbox } from '../ui/checkbox';

export interface FilterCheckboxProps {
  text: string;
  value: string;
  endAdornment?: React.ReactNode;
  onCheckedChange?: (checked: boolean) => void;
  checked?: boolean;
  name?: string;
}

export const FilterCheckbox: React.FC<FilterCheckboxProps> = ({
  text,
  value,
  endAdornment,
  onCheckedChange,
  checked,
  name,
}) => {
  return (
    <div className="flex items-center gap-1 sm:gap-2 min-h-[36px]">
      <Checkbox
        onCheckedChange={onCheckedChange}
        checked={checked}
        value={value}
        className="h-5 w-5 sm:h-6 sm:w-6 rounded-[8px]"
        id={`checkbox-${name}-${String(value)}`}
      />
      <label htmlFor={`checkbox-${name}-${String(value)}`} className="flex-1 cursor-pointer leading-none">
        {text}
      </label>
      {endAdornment}
    </div>
  );
};
