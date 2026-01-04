import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// type Definition for prisma
const globalForPrisma = global as unknown as {
    prisma: PrismaClient;
}

// Neon pooled connection (IMPORTANT)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

// No new prisma client instances created during hot reloading in Development env
const adapter = new PrismaPg(pool)

const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter,
})

// In Production - This Happens
// const prisma = new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}

export default prisma