import { InfoBlock } from '@/shared/components';

export default function UnauthorizedPage() {
  return (
    <div className="w-full max-w-md mx-auto px-4 md:px-8 py-24 flex flex-col items-center justify-center">
      <InfoBlock
        title="Доступ запрещен"
        text="Данную страницу могут просматривать только зарегистрированные пользователи "
        image="/assets/lock.png"
      />
    </div>
  );
}
