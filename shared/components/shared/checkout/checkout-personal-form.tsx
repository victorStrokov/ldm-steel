import React from 'react';
import { WhiteBlock } from '../white-block';
import { FormInput } from '../form';

interface Props {
  className?: string;
}

export const CheckoutPersonalForm: React.FC<Props> = ({ className }) => {
  return (
    <WhiteBlock title="2. Персональные данные" className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
        <FormInput name="firstName" className="text-sm sm:text-base" placeholder="Имя" />
        <FormInput name="lastName" className="text-sm sm:text-base" placeholder="Фамилия" />
        <FormInput name="email" className="text-sm sm:text-base" placeholder="E-mail" />
        <FormInput name="phone" className="text-sm sm:text-base" placeholder="Телефон" />
        {/* React IMask длятз форматирование номера телефона */}
      </div>
    </WhiteBlock>
  );
};
