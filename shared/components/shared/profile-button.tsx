import React from 'react';
import { Button } from '../ui/button';
import { CircleUser, User } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Props {
  onClickSignIn?: () => void;
  className?: string;
}

export const ProfileButton: React.FC<Props> = ({ className, onClickSignIn }) => {
  const { data: session } = useSession();

  return (
    <div className={className}>
      {!session ? (
        <Button
          onClick={onClickSignIn}
          variant="outline"
          className="flex items-center gap-2 md:gap-3 w-full max-w-xs md:max-w-none px-3 py-2 md:px-4 md:py-2.5"
        >
          <User className="w-5 h-5 md:w-6 md:h-6" />
          <span className="text-sm md:text-base">Войти</span>
        </Button>
      ) : (
        <Link href="/profile" className="w-full max-w-xs md:max-w-none block">
          <Button
            variant="secondary"
            className="flex items-center gap-2 md:gap-3 w-full px-3 py-2 md:px-4 md:py-2.5"
          >
            <CircleUser className="w-6 h-6 md:w-7 md:h-7" />
            <span className="text-sm md:text-base">Профиль</span>
          </Button>
        </Link>
      )}
    </div>
  );
};
