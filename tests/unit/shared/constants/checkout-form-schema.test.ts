import { checkoutFormSchema } from '@/shared/constants/checkout-form-schema';

describe('checkoutFormSchema', () => {
  it('passes with valid checkout data', () => {
    const parsed = checkoutFormSchema.parse({
      firstName: 'Ivan',
      lastName: 'Petrov',
      email: 'ivan@example.com',
      phone: '+79991234567',
      address: 'Moscow, Tverskaya 1',
      comment: 'Call before delivery',
    });

    expect(parsed.email).toBe('ivan@example.com');
  });

  it('fails when required fields are invalid', () => {
    const result = checkoutFormSchema.safeParse({
      firstName: 'I',
      lastName: '',
      email: 'not-email',
      phone: '123',
      address: 'ab',
    });

    expect(result.success).toBe(false);
  });
});
