'use client';

import { Input } from '../../ui';
import { RequiredSymbol } from '../required-symbol';
import { ErrorText } from '../error-text';
import { ClearButton } from '../clear-button';
import { useFormContext } from 'react-hook-form';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export const FormInput: React.FC<Props> = ({ name, label, required, className, ...props }) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const value = watch(name);
  const errorText = errors[name]?.message as string;

  const onClickClear = () => {
    setValue(name, '', { shouldValidate: true });
  };

  return (
    <div className={className}>
      {label && (
        <p className="mb-1 sm:mb-2 font-medium text-sm sm:text-base">
          {label}
          {required && <RequiredSymbol />}
        </p>
      )}

      <div className="relative">
        <Input className="text-sm sm:text-md h-10 sm:h-12" {...register(name)} {...props} />
        {value && <ClearButton onClick={onClickClear} />}
      </div>

      {errorText && <ErrorText text={errorText} className="mt-1 sm:mt-2 text-xs sm:text-sm" />}
    </div>
  );
};
