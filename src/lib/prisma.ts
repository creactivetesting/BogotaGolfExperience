import { PrismaClient } from '@/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});

function createPrismaClient() {
  return new PrismaClient({ adapter });
}

const cachedPrisma = globalForPrisma.prisma;
const hasValidBlogDelegate = Boolean(
  cachedPrisma &&
  typeof (cachedPrisma as unknown as { blogPost?: { findMany?: unknown } }).blogPost?.findMany === 'function',
);

export const prisma = hasValidBlogDelegate ? cachedPrisma : createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
