import React from 'react';
import { WhiteBlock } from '../white-block';

import { FormTextarea } from '../form';
import { AddresInput } from '../addres-input';

interface Props {
  className?: string;
}

export const CheckoutAddressForm: React.FC<Props> = ({ className }) => {
  return (
    <WhiteBlock title="3. Адрес доставки " className={className}>
      <div className="flex flex-col gap-5">
        {/* <Input name="address" className="text-base" placeholder="Введите адрес..." /> */}

        <AddresInput onChange={(value) => console.log(value)} />

        <FormTextarea rows={5} name="comment" className="text-base" placeholder="Комментарий к заказу" />
      </div>
    </WhiteBlock>
  );
};
