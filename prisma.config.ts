import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
});

//   "prisma": {
//     "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
//   },
