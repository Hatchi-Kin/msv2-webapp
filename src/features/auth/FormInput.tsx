import React from "react";
import { Input } from "@/components/ui/input";

interface FormInputProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
  required?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  icon,
  required = false,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block font-semibold mb-2 text-sm text-foreground"
      >
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary opacity-60">
          {icon}
        </div>
        <Input
          type={type}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="pl-12 h-12 border-2 rounded-xl transition-all duration-300 border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
          required={required}
        />
      </div>
    </div>
  );
};

export default FormInput;
