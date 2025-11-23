'use client';
import dynamic from 'next/dynamic';

import React from 'react';

import 'react-dadata/dist/react-dadata.css';

interface Props {
  onChange?: (value?: string) => void;
}

const AddressSuggestions = dynamic(() => import('react-dadata').then((mod) => mod.AddressSuggestions), { ssr: false });

export const AddresInput: React.FC<Props> = ({ onChange }) => {
  return (
    <AddressSuggestions token="357fcdfc92416460a13c6def8ddf41d802aba6e0" onChange={(data) => onChange?.(data?.value)} />
  );
};
