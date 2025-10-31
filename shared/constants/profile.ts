import { buildOptions } from '../lib/utils';

export const mapProfileLength = {
  1: '2 м',
  2: '6 м',
  3: '6.5 м',
} as const;

export const mapProfileType = {
  1: 'до 1.5 мм',
  2: 'до 2 мм',
  3: 'от 2 мм',
} as const;

export const mapProfileSize: Record<number, string> = {
  1: '30 x 30',
  2: '40 x 40',
  3: '50 x 50',
  4: '60 x 60',
  5: '70 x 70',
};

export const mapProfileColor = {
  1: 'Белый',
  2: 'Коричневый',
  3: 'Антрацит',
  4: 'Золотой дуб',
  5: 'Темный дуб',
  6: 'Серый',
  7: 'Черный',
} as const;

export const mapProfileShape = {
  1: 'Прямоугольный',
  2: 'Круглый',
  3: 'Трапециевидный',
} as const;

export const profileSizes = buildOptions(mapProfileSize);
export const profileLengths = buildOptions(mapProfileLength);
export const profileTypes = buildOptions(mapProfileType);
export const profileColors = buildOptions(mapProfileColor);
export const profileShapes = buildOptions(mapProfileShape);
