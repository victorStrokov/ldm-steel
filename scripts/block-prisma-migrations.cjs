#!/usr/bin/env node

console.error('');
console.error('Prisma migrations are blocked in ldm-steel.');
console.error('Run migrations only from admin-panel.');
console.error('');
console.error('Use:');
console.error('  1) cd ../admin-panel');
console.error('  2) npm run prisma:migrate');
console.error('');
process.exit(1);
