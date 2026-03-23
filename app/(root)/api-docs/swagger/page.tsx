import SwaggerUI from '@/shared/components/shared/swagger-ui';

export default function SwaggerDocsPage() {
  return (
    <section className="py-8 md:py-12 space-y-4">
      <h1 className="text-2xl md:text-3xl font-bold">Swagger UI</h1>
      <p className="text-sm md:text-base text-slate-600">
        Интерактивная документация API с возможностью выполнять запросы через Try it out.
      </p>

      <div className="rounded-xl border border-slate-200 bg-white p-3 md:p-4">
        <SwaggerUI />
      </div>
    </section>
  );
}
