import clsx from 'clsx';
import React from 'react';

type TitleSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface Props {
  text: string;
  size?: TitleSize;
  className?: string;
}

export const Title: React.FC<Props> = ({ size = 'sm', text, className }) => {
  const mapTagBySize = {
    xs: 'h6',
    sm: 'h5',
    md: 'h4',
    lg: 'h3',
    xl: 'h2',
    '2xl': 'h1',
  } as const;

  const mapClassNameBySize = {
    xs: 'text-[16px]',
    sm: 'text-[22px]',
    md: 'text-[26px]',
    lg: 'text-[32px]',
    xl: 'text-[40px]',
    '2xl': 'text-[48px]',
  };

  return React.createElement(
    mapTagBySize[size],
    { className: clsx(mapClassNameBySize[size], className) },
    text,
  );
};
