'use client';

import { Input } from '@/shared/components/ui/input';
import dynamic from 'next/dynamic';
import 'react-dadata/dist/react-dadata.css';

import { ClearButton } from './clear-button';
import { useFormContext } from 'react-hook-form';

const AddressSuggestions = dynamic(() => import('react-dadata').then((mod) => mod.AddressSuggestions), { ssr: false });

interface Props {
  name: string;
  value?: string;
  onChange?: (value?: string) => void;
  className?: string;
}

export const AddresInput: React.FC<Props> = ({ value, onChange, className }) => {
  const {} = useFormContext();

  return (
    <div className="relative w-full">
      <AddressSuggestions
        token="357fcdfc92416460a13c6def8ddf41d802aba6e0"
        defaultQuery={value} // строка из формы
        customInput={(props) => (
          <div className="relative">
            <Input
              {...props}
              className={`w-full h-9 text-base px-3 py-2 rounded-md border border-input shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] 
              ${className ?? ''}`}
            />
            {value && (
              <ClearButton
                onClick={() => {
                  onChange?.('');
                  props.onChange?.({
                    target: { value: '' },
                  } as React.ChangeEvent<HTMLInputElement>);
                }}
              />
            )}
          </div>
        )}
        onChange={(data) => onChange?.(data?.value)} // в форму кладём строку
      />
    </div>
  );
};

// import dynamic from 'next/dynamic';

// import React from 'react';

// import 'react-dadata/dist/react-dadata.css';

// interface Props {
//   onChange?: (value?: string) => void;
// }

// const AddressSuggestions = dynamic(() => import('react-dadata').then((mod) => mod.AddressSuggestions), { ssr: false });

// export const AddresInput: React.FC<Props> = ({ onChange }) => {
//   return (
//     <AddressSuggestions token="357fcdfc92416460a13c6def8ddf41d802aba6e0" onChange={(data) => onChange?.(data?.value)} />
//   );
// };
