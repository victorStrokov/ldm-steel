/// <reference types="node" />

import { defineConfig } from 'prisma/config';

const databaseUrl = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL or DATABASE_URL_UNPOOLED is required');
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: databaseUrl,
  },
});

//   "prisma": {
//     "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
//   },
