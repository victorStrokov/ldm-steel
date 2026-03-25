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
    <div className={cn(className, 'flex w-[840px] items-center justify-between gap-12')}>
      <div className="flex flex-col">
        <div className="w-[445px]">
          <Title size="lg" text={title} className="font-extrabold" />
          <p className="text-lg text-gray-400">{text}</p>
        </div>

        <div className="mt-11 flex gap-5">
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft />
              На главную
            </Button>
          </Link>

          <a href="">
            <Button variant="outline" className="border-gray-400 text-gray-500 hover:bg-gray-50">
              Обновить
            </Button>
          </a>
        </div>
      </div>

      {image && <img src={image} alt={title} width={500} height={500} />}
    </div>
  );
};
