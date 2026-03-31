import clsx from 'clsx';
import React from 'react';

type TitleSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface Props {
  text?: string;
  size?: TitleSize;
  className?: string;
  children?: React.ReactNode;
}

export const Title: React.FC<Props> = ({ size = 'sm', text, className, children }) => {
  const mapTagBySize = {
    xs: 'h6',
    sm: 'h5',
    md: 'h4',
    lg: 'h3',
    xl: 'h2',
    '2xl': 'h1',
  } as const;

  const mapClassNameBySize = {
    xs: 'text-base md:text-[16px]',
    sm: 'text-lg md:text-[22px]',
    md: 'text-xl md:text-[26px]',
    lg: 'text-2xl md:text-[32px]',
    xl: 'text-3xl md:text-[40px]',
    '2xl': 'text-4xl md:text-[48px]',
  };

  return React.createElement(
    mapTagBySize[size],
    { className: clsx(mapClassNameBySize[size], className) },
    children ?? text,
  );
};
