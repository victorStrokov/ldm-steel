'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="text-2xl font-bold">Что-то пошло не так</h1>
          <p className="text-sm text-gray-600">Ошибка уже отправлена в мониторинг.</p>
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
          >
            Попробовать снова
          </button>
        </main>
      </body>
    </html>
  );
}
