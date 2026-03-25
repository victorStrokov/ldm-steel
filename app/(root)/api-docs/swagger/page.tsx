import dynamic from 'next/dynamic';

const SwaggerUI = dynamic(() => import('@/shared/components/shared/swagger-ui'), { ssr: false });

export default function SwaggerDocsPage() {
  return (
    <section className="space-y-4 py-8 md:py-12">
      <h1 className="text-2xl font-bold md:text-3xl">Swagger UI</h1>
      <p className="text-sm text-slate-600 md:text-base">
        Интерактивная документация API с возможностью выполнять запросы через Try it out.
      </p>

      <div className="rounded-xl border border-slate-200 bg-white p-3 md:p-4">
        <SwaggerUI />
      </div>
    </section>
  );
}
