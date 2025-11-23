import { z } from 'zod';

export const checkoutFormSchema = z.object({
  firstName: z.string().min(2, { message: 'Имя должно содержать минимум 2 символа' }),
  lastName: z.string().min(2, { message: 'Фамилия должна содержать минимум 2 символа' }),
  email: z.string().email({ message: 'Некорректный email' }),
  phone: z.string().min(10, { message: 'Телефон должен содержать минимум 7 символов' }),
  address: z.string().min(4, { message: 'Адрес должен содержать минимум 4 символа' }),
  comment: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
