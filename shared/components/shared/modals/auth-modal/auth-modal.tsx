'use client';

import { Button } from '@/shared/components/ui';
import { Dialog, DialogContent } from '@/shared/components/ui/dialog';
import { signIn } from 'next-auth/react';

import React from 'react';
import { LoginForm } from './forms/login-form';
import { RegisterForm } from './forms/register-form';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<Props> = ({ open, onClose }) => {
  const [type, setType] = React.useState<'login' | 'register'>('login');

  const onSwitchType = () => {
    setType(type === 'login' ? 'register' : 'login');
  };
  const handelCloase = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handelCloase}>
      <DialogContent className="w-full max-w-xs sm:max-w-md sm:w-md bg-white p-4 sm:p-10">
        {type === 'login' ? <LoginForm onClose={handelCloase} /> : <RegisterForm onClose={handelCloase} />}

        <hr />
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="secondary"
            onClick={() => signIn('github', { callbackUrl: '/', redirect: true })}
            type="button"
            className="h-10 sm:h-12 flex-1 gap-2 p-2"
          >
            <img className="h-5 w-5 sm:h-6 sm:w-6" src="https://github.githubassets.com/favicons/favicon.svg" alt="GitHub" />
            GitHub
          </Button>

          <Button
            variant="secondary"
            onClick={() => signIn('google', { callbackUrl: '/', redirect: true })}
            type="button"
            className="h-10 sm:h-12 flex-1 gap-2 p-2"
          >
            <img
              className="h-5 w-5 sm:h-6 sm:w-6"
              src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
              alt="Google"
            />
            Google
          </Button>
          <Button
            variant="secondary"
            onClick={() => signIn('mailru', { callbackUrl: '/', redirect: true })}
            type="button"
            className="h-10 sm:h-12 flex-1 gap-2 p-2"
          >
            <img
              className="h-6 w-6 sm:h-7 sm:w-7"
              src="https://home.imgsmail.ru/whiteline/assets/logo/dark/logo.svg?_1765229105625"
              alt="Mail.ru"
            />
          </Button>
        </div>
        <Button variant="outline" onClick={onSwitchType} type="button" className="h-10 sm:h-12 mt-2">
          {type !== 'login' ? 'Вход' : 'Регистрация'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
