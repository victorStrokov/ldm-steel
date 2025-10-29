export const mapProfileLength = {
  1: '2м',
  2: '6м',
  3: '6.5м',
} as const;

export const mapProfileType = {
  1: 'до 1.5 мм',
  2: 'до 2 мм',
  3: 'от 2 мм',
} as const;

export const mapProfileSize = {
  1: '30 x 30 ',
  2: '60 x 60',
  3: '50 x 50',
  4: '70 x 70',
} as const;

export const profileSizes = Object.entries(mapProfileSize).map(([name, value]) => ({
  name,
  value,
}));
