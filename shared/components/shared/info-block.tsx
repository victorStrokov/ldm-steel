import { cn } from '@/shared/lib/utils';
import { Title } from './title';
import Link from 'next/link';
import { Button } from '../ui';
import { ArrowLeft } from 'lucide-react';

interface Props {
  title: string;
  text: string;
  className?: string;
  image?: string;
}

export const InfoBlock: React.FC<Props> = ({ title, text, className, image }) => {
  return (
    <div
      className={cn(
        'flex flex-col md:flex-row w-full max-w-5xl items-center justify-between gap-6 md:gap-12 px-2 sm:px-4 py-6 mx-auto',
        className
      )}
    >
      <div className="flex flex-col w-full md:w-[445px] max-w-full">
        <div className="w-full">
          <Title size="lg" text={title} className="font-extrabold mb-2 md:mb-4 text-center md:text-left" />
          <p className="text-base sm:text-lg text-gray-400 text-center md:text-left">{text}</p>
        </div>

        <div className="mt-8 md:mt-11 flex flex-col sm:flex-row gap-3 sm:gap-5 items-center md:items-start justify-center md:justify-start">
          <Link href="/">
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <ArrowLeft />
              На главную
            </Button>
          </Link>

          <a href="">
            <Button variant="outline" className="border-gray-400 text-gray-500 hover:bg-gray-50 w-full sm:w-auto">
              Обновить
            </Button>
          </a>
        </div>
      </div>

      {image && (
        <img
          src={image}
          alt={title}
          className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg w-full h-auto mb-4 md:mb-0 rounded-md shadow"
          width={400}
          height={400}
        />
      )}
    </div>
  );
};
