import React from 'react';
import { Input } from '@/components/ui/input';
import { MOCHA_THEME } from '@/constants/theme';
import { useThemeHover } from '@/hooks/useThemeHover';

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
  const { handleInputFocus, handleInputBlur } = useThemeHover();

  return (
    <div>
      <label
        htmlFor={id}
        className="block font-semibold mb-2 text-sm"
        style={{ color: MOCHA_THEME.colors.text }}
      >
        {label}
      </label>
      <div className="relative">
        <div
          className="absolute left-4 top-1/2 transform -translate-y-1/2"
          style={{ color: MOCHA_THEME.colors.primary, opacity: MOCHA_THEME.opacity.semiTransparent }}
        >
          {icon}
        </div>
        <Input
          type={type}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="pl-12 h-12 border-2 rounded-xl transition-all duration-300"
          style={{
            borderColor: MOCHA_THEME.colors.border,
            backgroundColor: MOCHA_THEME.colors.background,
            color: MOCHA_THEME.colors.text,
          }}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          required={required}
        />
      </div>
    </div>
  );
};

export default FormInput;
