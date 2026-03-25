import { InfoBlock } from '@/shared/components';

export default function UnauthorizedPage() {
  return (
    <div className="mt-40 flex flex-col items-center justify-center">
      <InfoBlock
        title="Доступ запрещен"
        text="Данную страницу могут просматривать только зарегистрированные пользователи "
        image="/assets/lock.png"
      />
    </div>
  );
}
