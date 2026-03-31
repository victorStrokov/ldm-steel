'use client';

import React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/shared/lib/utils';

type SliderProps = {
  className?: string;
  min: number;
  max: number;
  step: number;
  formatLabel?: (value: number) => string;
  value?: number[] | readonly number[];
  onValueChange?: (values: number[]) => void;
};

const RangeSlider = React.forwardRef(
  ({ className, min, max, step, formatLabel, value, onValueChange, ...props }: SliderProps, ref) => {
    const initialValue = Array.isArray(value) ? value : [min, max];
    const [localValues, setLocalValues] = React.useState(initialValue);

    React.useEffect(() => {
      // Update localValues when the external value prop changes
      setLocalValues(Array.isArray(value) ? value : [min, max]);
    }, [min, max, value]);

    const handleValueChange = (newValues: number[]) => {
      setLocalValues(newValues);
      if (onValueChange) {
        onValueChange(newValues);
      }
    };

    return (
      <SliderPrimitive.Root
        ref={ref as React.RefObject<HTMLDivElement>}
        min={min}
        max={max}
        step={step}
        value={localValues}
        onValueChange={handleValueChange}
        className={cn(
          // Responsive: увеличиваем вертикальные отступы на мобильных
          'relative mb-6 flex w-full touch-none items-center select-none py-2 md:py-3',
          className,
        )}
        {...props}
      >
        <SliderPrimitive.Track className="bg-primary/20 relative h-1 w-full grow overflow-hidden rounded-full">
          <SliderPrimitive.Range className="bg-primary absolute h-full" />
        </SliderPrimitive.Track>
        {localValues.map((value, index) => (
          <React.Fragment key={index}>
            <div
              className="absolute text-center"
              style={{
                left: `calc(${((value - min) / (max - min)) * 100}% + 0px)`,
                // Responsive: увеличиваем отступ сверху на мобильных
                top: `18px`,
              }}
            >
              <span className="text-xs md:text-sm px-1 md:px-2">{formatLabel ? formatLabel(value) : value}</span>
            </div>
            <SliderPrimitive.Thumb
              className={cn(
                // Responsive: увеличиваем размер и область нажатия на мобильных
                'border-primary/50 focus-visible:ring-ring block h-7 w-7 md:h-5 md:w-5 rounded-full border bg-white shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
                // Увеличиваем область нажатия для мобильных
                'after:content-[""] after:absolute after:-inset-2 md:after:-inset-1 after:rounded-full after:pointer-events-auto after:bg-transparent'
              )}
            />
          </React.Fragment>
        ))}
      </SliderPrimitive.Root>
    );
  },
);

RangeSlider.displayName = SliderPrimitive.Root.displayName;

export { RangeSlider };
