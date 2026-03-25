import { openApiDocument } from '@/shared/lib/openapi';
import Link from 'next/link';

type PathItem = Record<string, { summary?: string; tags?: string[] }>;

const methodOrder = ['get', 'post', 'put', 'patch', 'delete'] as const;

function getMethodBadgeClass(method: string) {
  switch (method.toLowerCase()) {
    case 'get':
      return 'bg-emerald-100 text-emerald-800';
    case 'post':
      return 'bg-blue-100 text-blue-800';
    case 'put':
      return 'bg-amber-100 text-amber-800';
    case 'patch':
      return 'bg-violet-100 text-violet-800';
    case 'delete':
      return 'bg-rose-100 text-rose-800';
    default:
      return 'bg-slate-100 text-slate-800';
  }
}

export default function ApiDocsPage() {
  const paths = Object.entries(openApiDocument.paths) as Array<[string, PathItem]>;

  return (
    <section className="space-y-6 py-8 md:py-12">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold md:text-3xl">API Documentation</h1>
        <p className="text-sm text-slate-600 md:text-base">
          OpenAPI спецификация доступна по ссылке{' '}
          <Link href="/api/openapi" className="underline underline-offset-4">
            /api/openapi
          </Link>
          .
        </p>
        <p className="text-sm text-slate-600 md:text-base">
          Интерактивная Swagger UI страница:{' '}
          <Link href="/api-docs/swagger" className="underline underline-offset-4">
            /api-docs/swagger
          </Link>
          .
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200">
        <div className="grid grid-cols-12 bg-slate-50 px-4 py-3 text-xs font-semibold tracking-wide text-slate-600 uppercase">
          <div className="col-span-2">Method</div>
          <div className="col-span-4">Path</div>
          <div className="col-span-3">Summary</div>
          <div className="col-span-3">Tag</div>
        </div>

        <div className="divide-y divide-slate-200">
          {paths.map(([path, methods]) =>
            methodOrder
              .filter((method) => Boolean(methods[method]))
              .map((method) => {
                const operation = methods[method];

                return (
                  <div key={`${method}-${path}`} className="grid grid-cols-12 items-center px-4 py-3 text-sm">
                    <div className="col-span-2">
                      <span
                        className={`inline-flex min-w-14 justify-center rounded-md px-2 py-1 text-xs font-semibold uppercase ${getMethodBadgeClass(method)}`}
                      >
                        {method}
                      </span>
                    </div>
                    <div className="col-span-4 font-mono text-xs break-all md:text-sm">/api{path}</div>
                    <div className="col-span-3 text-slate-700">{operation?.summary ?? '-'}</div>
                    <div className="col-span-3 text-slate-500">{operation?.tags?.[0] ?? '-'}</div>
                  </div>
                );
              }),
          )}
        </div>
      </div>
    </section>
  );
}
