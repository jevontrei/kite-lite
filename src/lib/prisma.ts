import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// i was initially following this: https://www.prisma.io/docs/orm/more/help-and-troubleshooting/nextjs-help
// but prisma changed and this was documented badly:  https://github.com/prisma/prisma/issues/28670
// so we need an adapter, which we need to pass to PrismaClient()

const adapter = new PrismaPg(pool);

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
