export interface CartItemProps {
  id: number;
  imageUrl: string | null;
  details: string;
  name: string;
  price: number;
  quantity: number;
  disabled?: boolean;
}
