import { Minus, Plus } from 'lucide-react';
import { CountButtonProps } from './count-button';
import { Button } from '../ui/button';
import { cn } from '@/shared/lib/utils';

interface IconButtonProps {
  size?: CountButtonProps['size'];
  disabled?: boolean;
  type?: 'plus' | 'minus';
  onClick?: () => void;
}

export const CountIconButton: React.FC<IconButtonProps> = ({ size = 'sm', disabled, type, onClick }) => {
  return (
    <Button
      variant="outline"
      disabled={disabled}
      onClick={onClick}
      type="button"
      className={cn(
        'hover:bg-primary p-0 hover:text-white disabled:border-gray-400 disabled:bg-white disabled:text-gray-400 flex items-center justify-center gap-1',
        size === 'sm'
          ? 'h-[30px] w-[30px] rounded-[10px] sm:h-8 sm:w-8'
          : 'h-[38px] w-[38px] rounded-md sm:h-10 sm:w-10',
      )}
    >
      {type === 'plus' ? (
        <Plus className={size === 'sm' ? 'h-4 w-4 sm:h-5 sm:w-5' : 'h-5 w-5 sm:h-6 sm:w-6'} />
      ) : (
        <Minus className={size === 'sm' ? 'h-4 w-4 sm:h-5 sm:w-5' : 'h-5 w-5 sm:h-6 sm:w-6'} />
      )}
    </Button>
  );
};
