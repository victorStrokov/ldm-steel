import { CheckoutItemDetails, Container, Title, WhiteBlock } from '@/shared/components/shared';
import { Button, Input, Textarea } from '@/shared/components/ui';
import { ArrowBigRight, Coins, PackagePlus, RussianRuble, Truck } from 'lucide-react';
export default function CheckoutPage() {
  return (
    <Container className="mt-6">
      <Title text="Оформление заказа" className="font-extrabold text-blue-deep/90 mb-10 text-[36px]" />
      <div className="flex gap-10">
        {/* Левая часть  */}
        <div className="flex flex-col gap-10 flex-1 mb-20">
          <WhiteBlock title="1. Корзина"> 123123123</WhiteBlock>
          <WhiteBlock title="2. Персональные данные">
            <div className="grid grid-cols-2 gap-5">
              <Input name="firstName" className="text-base" placeholder="Имя" />
              <Input name="lastName" className="text-base" placeholder="Фамилия" />
              <Input name="email" className="text-base" placeholder="E-mail" />
              <Input name="phone" className="text-base" placeholder="Телефон" />
            </div>
          </WhiteBlock>
          <WhiteBlock title="3. Адрес доставки ">
            <div className="flex flex-col gap-5">
              <Input name="address" className="text-base" placeholder="Введите адрес..." />
              <Textarea rows={5} name="comment" className="text-base" placeholder="Комментарий к заказу" />
            </div>
          </WhiteBlock>
        </div>

        {/* Правая часть */}
        <div className="w-[450px]">
          <WhiteBlock className="p-6 sticky top-4">
            <div className="flex flex-col gap-1">
              <span className="text-xl">Итого:</span>
              <span className="text-[34px] font-extrabold">{456677} ₽</span>
            </div>
            <CheckoutItemDetails
              title={
                <div className="flex items-center">
                  <RussianRuble size={18} className="mr-3 text-gray-400" />
                  Сумма заказа:
                </div>
              }
              value="40000"
            />
            <CheckoutItemDetails
              title={
                <div className="flex items-center">
                  <Coins size={18} className="mr-3  text-gray-400" />
                  НДС (18%):
                </div>
              }
              value="4000"
            />
            <CheckoutItemDetails
              title={
                <div className="flex items-center">
                  <PackagePlus size={18} className="mr-3  text-gray-400" />
                  Услуги упаковки:
                </div>
              }
              value="400"
            />
            <CheckoutItemDetails
              title={
                <div className="flex items-center">
                  <Truck size={18} className="mr-3  text-gray-400" />
                  Доставка:
                </div>
              }
              value="4000"
            />
            <Button type="submit" disabled={false} className="w-full h-14 rounded-2xl mt-6 text-base font-bold">
              Перейти к оплате
              <ArrowBigRight size={20} className="w-5 ml-2" />
            </Button>
          </WhiteBlock>
        </div>
      </div>
    </Container>
  );
}
