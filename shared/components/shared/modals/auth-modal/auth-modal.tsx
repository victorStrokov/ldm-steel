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
      <DialogContent className="w-[450px] bg-white p-10">
        {type === 'login' ? <LoginForm onClose={handelCloase} /> : <RegisterForm onClose={handelCloase} />}

        <hr />
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => signIn('github', { callbackUrl: '/', redirect: true })}
            type="button"
            className="gap-2 h-12 p-2 flex-1"
          >
            <img className="w-6 h-6" src="https://github.githubassets.com/favicons/favicon.svg" alt="GitHub" />
            GitHub
          </Button>

          <Button
            variant="secondary"
            onClick={() => signIn('google', { callbackUrl: '/', redirect: true })}
            type="button"
            className="gap-2 h-12 p-2 flex-1"
          >
            <img
              className="w-6 h-6"
              src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
              alt="Google"
            />
            Google
          </Button>
          <Button
            variant="secondary"
            onClick={() => signIn('mailru', { callbackUrl: '/', redirect: true })}
            type="button"
            className="gap-2 h-12 p-2 flex-1"
          >
            <img
              className="w-18 h-18"
              src="https://home.imgsmail.ru/whiteline/assets/logo/dark/logo.svg?_1765229105625"
              alt="Mail.ru"
            />
          </Button>
        </div>
        <Button variant="outline" onClick={onSwitchType} type="button" className="h-12">
          {type !== 'login' ? 'Вход' : 'Регистрация'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
